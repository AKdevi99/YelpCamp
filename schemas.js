const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string()
            .required()
            .messages({
                'string.base': 'Title must be a string.',
                'string.empty': 'Title is required.',
            }),
        price: Joi.number()
            .required()
            .min(0)
            .messages({
                'number.base': 'Price must be a number.',
                'number.min': 'Price must be at least 0.',
                'any.required': 'Price is required.',
            }),
        image: Joi.string()
            .required()
            .messages({
                'string.base': 'Image must be a valid URL string.',
                'string.empty': 'Image is required.',
            }),
        description: Joi.string()
            .required()
            .messages({
                'string.base': 'Description must be a string.',
                'string.empty': 'Description is required.',
            }),
        location: Joi.string()
            .required()
            .messages({
                'string.base': 'Location must be a string.',
                'string.empty': 'Location is required.',
            }),
    }).required().messages({
        'object.base': 'Campground data must be an object.',
        'any.required': 'Campground data is required.',
    }),
});


module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body:Joi.string().required()
    }).required()
})
