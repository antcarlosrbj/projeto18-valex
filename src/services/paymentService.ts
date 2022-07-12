import dayjs from 'dayjs';
import bcrypt from 'bcrypt';

import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";

import * as cardsService from "../services/cardsService.js";

import * as schema from "../utils/joiUtils.js";

export async function validatePayment(cardId, password, businessId, amount) {

    /* ---------------------------------- JOI ---------------------------------- */
    const validation = schema.payment.validate({cardId, password, businessId, amount})
    
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

    /* ---------------------------- CHECK PASSWORD ----------------------------- */
    if (!bcrypt.compareSync(password, card.password)) {
        return {res: false, text: "Invalid password"};
    }

    /* ------------------------ BUSINESS IS REGISTERED? ------------------------ */
    const business = await businessRepository.findById(businessId);
    if (!business) {
        return {res: false, text: "Business not found"};
    }

    /* ----------------------------- BUSINESS TYPE ----------------------------- */
    if (business.type !== card.type) {
        return {res: false, text: "Business type and card type are different"};
    }

    /* ----------------------- IS THERE MONEY AVAILABLE? ----------------------- */
    const { balance } = await cardsService.getTransactionsInTheDatabase(cardId);
    
    if (balance < amount) {
        return {res: false, text: "Balance unavailable"};
    }


    return {res: true}
    
}

export async function insertPayment(cardId, businessId, amount) {

    await paymentRepository.insert({cardId, businessId, amount});
    return true;
    
}