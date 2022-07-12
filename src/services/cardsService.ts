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
  
  if (!Number.isInteger(employeeId)) {
    return {res: false, text: "employee id format is wrong"};
  }
  
  const employee = await employeeRepository.findById(employeeId);
  
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

  let balance = 0;

  paymentStatement.forEach(e => {
    balance -= e.amount;
    e.timestamp = dayjs(e.timestamp).format('DD/MM/YYYY');
  })
  rechargeStatement.forEach(e => {
    balance += e.amount;
    e.timestamp = dayjs(e.timestamp).format('DD/MM/YYYY');
  })

  return {
    balance: balance,
    transactions: paymentStatement,
    recharges: rechargeStatement
  };
}