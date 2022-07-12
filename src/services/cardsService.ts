import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
import Joi from 'joi';
import bcrypt from 'bcrypt';

import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as schema from "../utils/joiUtils.js";

export async function validateCreation(apiKey, employeeId, cardType) {
  
  const company = await companyRepository.findByApiKey(apiKey);
  if (!company) {
    return {res: false, text: "API Key invalid"};
  }
  
  if (!/^[0-9]+$/.test(employeeId)) {
    return {res: false, text: "employee id format is wrong"};
  }
  
  const employee = await employeeRepository.findById(employeeId);

  if (!employee) {
    return {res: false, text: "Employee not found"};
  }
  
  if (employee.companyId !== company.id) {
    return {res: false, text: "Employee does not belong to this company"};
  }
  
  if (!['groceries', 'restaurant', 'transport', 'education', 'health'].includes(cardType)) {
    return {res: false, text: "Wrong card type"};
  }
  
  if (await cardRepository.findByTypeAndEmployeeId(cardType, employee.id)) {
    return {res: false, text: "Employee has this type of card"};
  }
  
  return {res: true};
}

export async function createCard(employeeId, cardType) {
  const employee = await employeeRepository.findById(employeeId);

  const cardholderName = generator.cardholderName(employee.fullName);

  const cryptr = new Cryptr(process.env.SECRET);
  const securityCode = cryptr.encrypt(faker.finance.creditCardCVV());
  
  cardRepository.insert({
    employeeId: employeeId,
    number: faker.finance.creditCardNumber('#{16}'),
    cardholderName: cardholderName,
    securityCode: securityCode,
    expirationDate: dayjs().add(5, 'year').format('MM/YY'),
    password: null,
    isVirtual: false,
    originalCardId: null,
    isBlocked: false,
    type: cardType
  })

  return true;
}

const generator = {
  cardholderName: fullName => {
    const fullNameToArray = fullName.split(" ").filter(e => e.length > 2);
    const cardholderName = fullNameToArray.map(e => e[0]);
    cardholderName[0] = fullNameToArray[0];
    cardholderName[cardholderName.length-1] = fullNameToArray[fullNameToArray.length-1];
    return cardholderName.join(" ").toUpperCase();
  }
}

export async function validateActivation(cardNumber, cardholderName, expirationDate, securityCode, password) {

  /* ---------------------------------- JOI ---------------------------------- */
  const validation = schema.activation.validate({cardNumber: cardNumber, cardholderName: cardholderName, expirationDate: expirationDate, securityCode: securityCode, password: password})
  
  if (validation.error) {
    return {res: false, text: validation.error.details[0].message};
  }

  /* --------------------------- DOES EXISTS CARD? --------------------------- */
  const card = await cardRepository.findByCardDetails(cardNumber, cardholderName, expirationDate)
  
  if (!card) {
    return {res: false, text: "Card not found"};
  }

  /* --------------------------- IS CARD ACTIVED? ---------------------------- */
  if (card.password) {
    return {res: false, text: "Card has already been activated"};
  }

  /* --------------------------- IS CARD EXPIRED? ---------------------------- */
  const [month, year] = card.expirationDate.split("/").map(e => parseInt(e))
  let expirationDateMilliseconds = dayjs(new Date(2000+year, month)).subtract(1, 'second').valueOf()
  
  if (expirationDateMilliseconds < dayjs().valueOf()) {
    return {res: false, text: "Card is expired"};
  }

  /* ------------------------ IS SECURITY CODE VALID? ------------------------ */
  const cryptr = new Cryptr(process.env.SECRET);
  const decryptedSecurityCode = cryptr.decrypt(card.securityCode);

  if (securityCode !== decryptedSecurityCode) {
    return {res: false, text: "Security code is invalid"};
  }

  return {res: true};
}

export async function savePassword(cardNumber, cardholderName, expirationDate, password) {

  const card = await cardRepository.findByCardDetails(cardNumber, cardholderName, expirationDate)
  const id = card.id;
  
  card.password = bcrypt.hashSync(password, 10);
  delete card.id
  
  await cardRepository.update(id, card);

  return true;
}

export async function getTransactionsInTheDatabase(cardId) {

  const paymentStatement = await paymentRepository.findByCardId(cardId);
  const rechargeStatement = await rechargeRepository.findByCardId(cardId);

  let paymentStatementAnswer = []
  for (let i = 0; i < paymentStatement.length; i++) {
    paymentStatementAnswer.push({
      id: 0, 
      cardId: 0, 
      businessId: 0, 
      timestamp: "", 
      amount: 0
    })
  }
  
  let rechargeStatementAnswer = [{id: 0, cardId: 0, timestamp: "", amount: 0},{id: 0, cardId: 0, timestamp: "", amount: 0}];
  for (let i = 0; i < rechargeStatement.length; i++) {
    rechargeStatementAnswer.push({
      id: 0, 
      cardId: 0, 
      timestamp: "", 
      amount: 0
    })
  }


  let balance = 0;

  paymentStatement.forEach((e, index) => {
    balance -= e.amount;
    paymentStatementAnswer[index].id = e.id;
    paymentStatementAnswer[index].cardId = e.cardId;
    paymentStatementAnswer[index].businessId = e.businessId;
    paymentStatementAnswer[index].timestamp = dayjs(e.timestamp).format('DD/MM/YYYY');
    paymentStatementAnswer[index].amount = e.amount
  })
  rechargeStatement.forEach((e, index) => {
    balance += e.amount;
    rechargeStatementAnswer[index].id = e.id;
    rechargeStatementAnswer[index].cardId = e.cardId;
    rechargeStatementAnswer[index].timestamp = dayjs(e.timestamp).format('DD/MM/YYYY');
    rechargeStatementAnswer[index].amount = e.amount
  })

  return {
    balance: balance,
    transactions: paymentStatement,
    recharges: rechargeStatement
  };
}

export async function blockOrUnblockCard(operation, cardId, password) {

  if (operation !== "block" && operation !== "unblock") {
    return {res: false, text: "Not Acceptable"};
  }

  /* ---------------------------------- JOI ---------------------------------- */
  const validation = schema.blockCard.validate({cardId: cardId, password: password});
  
  if (validation.error) {
    return {res: false, text: validation.error.details[0].message};
  }

  /* --------------------------- DOES EXISTS CARD? --------------------------- */
  const card = await cardRepository.findById(cardId)
  
  if (!card) {
    return {res: false, text: "Card not found"};
  }

  /* --------------------------- IS CARD ACTIVED? ---------------------------- */
  if (!card.password) {
    return {res: false, text: "Card is not active"};
  }

  /* --------------------- IS CARD BLOCKED OR UNBLOCKED? --------------------- */
  if (card.isBlocked && operation === "block") {
    return {res: false, text: "Card is blocked"};
  }

  if (!card.isBlocked && operation === "unblock") {
    return {res: false, text: "Card is unblocked"};
  }

  /* --------------------------- IS CARD EXPIRED? ---------------------------- */
  const [month, year] = card.expirationDate.split("/").map(e => parseInt(e))
  let expirationDateMilliseconds = dayjs(new Date(2000+year, month)).subtract(1, 'second').valueOf()
  
  if (expirationDateMilliseconds < dayjs().valueOf()) {
    return {res: false, text: "Card is expired"};
  }

  /* ---------------------------- CHECK PASSWORD ----------------------------- */
  if (!bcrypt.compareSync(password, card.password)) {
    return {res: false, text: "Invalid password"};
  }

  /* ------------------------- BLOCK OR UNBLOCK CARD ------------------------- */
  const id = card.id;
  
  operation === "block" ? card.isBlocked = true : card.isBlocked = false;
  delete card.id
  
  await cardRepository.update(id, card);

  return {res: true};
}