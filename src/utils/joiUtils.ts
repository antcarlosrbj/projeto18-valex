import Joi from 'joi';

export const activation = Joi.object({
    cardNumber: Joi.string().pattern(new RegExp('^[0-9]{16}$')).required(),
    cardholderName: Joi.string().required(),
    expirationDate: Joi.string().pattern(new RegExp('^[0-9]{2}/[0-9]{2}$')).required(),
    securityCode: Joi.string().pattern(new RegExp('^[0-9]{3}$')).required(),
    password: Joi.string().pattern(new RegExp('^[0-9]{4}$')).required()
});

export const blockCard = Joi.object({
    cardId: Joi.string().pattern(new RegExp('^[0-9]+$')).required(),
    password: Joi.string().pattern(new RegExp('^[0-9]{4}$')).required()
});

export const recharge = Joi.object({
    apiKey: Joi.string().required(),
    cardId: Joi.string().pattern(new RegExp('^[0-9]+$')).required(),
    amount: Joi.string().pattern(new RegExp('^[0-9]+$')).required()
});