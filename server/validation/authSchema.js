import { Joi } from 'celebrate';

const email = Joi.string().lowercase().email().required();
const password = Joi.string().min(7).required().strict();

export const createUserSchema = {
  body: {
    name: Joi.string()
      .regex(/^[A-Z]+ [A-Z]+$/i)
      .uppercase()
      .required(),
    email,
    password,
    confirm_password: Joi.any().valid(Joi.ref('password')).required(),
  },
};

export const logUserSchema = {
  body: {
    email,
    password,
  },
};
