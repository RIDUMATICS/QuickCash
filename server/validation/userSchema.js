import { Joi } from 'celebrate';

const password = Joi.string().min(8).required().strict();

export const updateUserSchema = {
  body: {
    name: Joi.string().messages({
      'string.base': 'enter a valid fullname',
    }),
    address: Joi.string().messages({
      'string.base': 'enter a valid address',
    }),
  },
};

export const updatePasswordSchema = {
  body: {
    oldPassword: password.messages({
      'string.base': 'enter a valid password',
      'string.min': 'password must be at least 8 characters',
      'any.required': 'OldPassword field is required',
    }),
    newPassword: password.invalid(Joi.ref('oldPassword')).messages({
      'string.base': 'enter a valid password',
      'string.min': 'password must be at least 8 characters',
      'any.required': 'newPassword field is required',
      'any.invalid': 'password cannot be changed to the old password',
    }),
    confirmPassword: Joi.any()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.required': 'confirmPassword field is required',
        'any.only': 'new password and confirm password does not match',
      }),
  },
};
