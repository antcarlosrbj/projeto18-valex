import Joi from 'joi';
export var activation = Joi.object({
    cardNumber: Joi.string().pattern(new RegExp('^[0-9]{16}$')).required(),
    cardholderName: Joi.string().required(),
    expirationDate: Joi.string().pattern(new RegExp('^[0-9]{2}/[0-9]{2}$')).required(),
    securityCode: Joi.string().pattern(new RegExp('^[0-9]{3}$')).required(),
    password: Joi.string().pattern(new RegExp('^[0-9]{4}$')).required()
});
export var blockCard = Joi.object({
    cardId: Joi.string().pattern(new RegExp('^[0-9]+$')).required(),
    password: Joi.string().pattern(new RegExp('^[0-9]{4}$')).required()
});
export var recharge = Joi.object({
    apiKey: Joi.string().required(),
    cardId: Joi.string().pattern(new RegExp('^[0-9]+$')).required(),
    amount: Joi.string().pattern(new RegExp('^[0-9]+$')).required()
});
export var payment = Joi.object({
    cardId: Joi.string().pattern(new RegExp('^[0-9]+$')).required(),
    password: Joi.string().pattern(new RegExp('^[0-9]{4}$')).required(),
    businessId: Joi.string().pattern(new RegExp('^[0-9]+$')).required(),
    amount: Joi.string().pattern(new RegExp('^[0-9]+$')).required()
});
