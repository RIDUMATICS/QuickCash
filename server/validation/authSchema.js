import { Joi } from 'celebrate';

const email = Joi.string().lowercase().email().required().messages({
  'string.base': 'enter a valid email',
  'string.email': 'enter a valid email',
  'any.required': 'email field is required',
});
const password = Joi.string().min(8).required().strict().messages({
  'string.base': 'enter a valid password',
  'string.min': 'password must be at least 8 characters',
  'any.required': 'password field is required',
});

export const createUserSchema = {
  body: {
    name: Joi.string().required().messages({
      'string.base': 'enter a valid fullname',
      'any.required': 'name field is required',
    }),
    address: Joi.string().required().messages({
      'string.base': 'enter a valid address',
      'any.required': 'address field is required',
    }),
    email,
    password,
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
      'any.required': 'confirmPassword field is required',
      'any.only': 'password and confirm password does not match',
    }),
  },
};

export const logUserSchema = {
  body: {
    email,
    password,
  },
};
