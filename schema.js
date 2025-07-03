const Joi = require('joi');

const listingJoiSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().allow("", null),
        }),
        coordinates:Joi.number(),
        feature:Joi.string(),
    }).required()
})

const reviewJoiSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
})

module.exports = { listingJoiSchema, reviewJoiSchema }