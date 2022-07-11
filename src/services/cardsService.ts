import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';

import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

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