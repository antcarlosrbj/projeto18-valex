import Joi from 'joi';

export const activation = Joi.object({
    cardNumber: Joi.string().pattern(new RegExp('^[0-9]{16}$')).required(),
    cardholderName: Joi.string().required(),
    expirationDate: Joi.string().pattern(new RegExp('^[0-9]{2}/[0-9]{2}$')).required(),
    securityCode: Joi.string().pattern(new RegExp('^[0-9]{3}$')).required(),
    password: Joi.string().pattern(new RegExp('^[0-9]{4}$')).required()
});