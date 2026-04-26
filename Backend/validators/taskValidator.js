import Joi from "joi";

export const createTaskSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.empty": "Title is required"
    }),
    description: Joi.string().allow("")
})