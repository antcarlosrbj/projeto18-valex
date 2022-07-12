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

export async function validateRecharge(apiKey, cardId, amount) {

    /* ---------------------------------- JOI ---------------------------------- */
    const validation = schema.recharge.validate({apiKey: apiKey, cardId: cardId, amount: amount})
    
    if (validation.error) {
        return {res: false, text: validation.error.details[0].message};
    }

    if (Number(amount) <= 0) {
        return {res: false, text: "Amount must be greater than 0"};
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

    /* --------------------------- IS CARD BLOCKED? ---------------------------- */
    if (card.isBlocked) {
        return {res: false, text: "Card is blocked"};
    }

    /* --------------------------- IS CARD EXPIRED? ---------------------------- */
    const [month, year] = card.expirationDate.split("/").map(e => parseInt(e))
    let expirationDateMilliseconds = dayjs(new Date(2000+year, month)).subtract(1, 'second').valueOf()
    
    if (expirationDateMilliseconds < dayjs().valueOf()) {
        return {res: false, text: "Card is expired"};
    }

    /* ------------------------ BELONG TO THIS COMPANY? ------------------------ */
    const employee = await employeeRepository.findById(card.employeeId)
    const company = await companyRepository.findByApiKey(apiKey)

    if (employee.companyId !== company.id) {
        return {res: false, text: "Employee does not work for this company"};
    }

    return {res: true}
    
}

export async function insertRecharge(cardId, amount) {

    await rechargeRepository.insert({cardId, amount});
    return true;
    
}