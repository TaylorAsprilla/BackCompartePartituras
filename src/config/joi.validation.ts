import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required().default(3306),
  DB_USERNAME: Joi.string().required(),
  PORT: Joi.number().required().default(3002),
});
