import { Joi } from 'celebrate';

const amount = Joi.number().positive().required().messages({
  'number.base': 'enter a valid amount',
  'number.positive': 'enter a valid amount',
  'any.required': 'amount field is required',
});

const tenor = Joi.number().integer().min(6).max(12).required().messages({
  'number.base': 'enter a valid tenor',
  'number.min': 'tenor is 6 - 12 months',
  'number.max': 'tenor is 6 - 12 months',
  'any.required': 'tenor field is required',
});

export const getProratedPaymentSchema = {
  query: {
    amount,
    tenor,
  },
};
export const createLoanSchema = {
  body: {
    amount,
    tenor,
  },
};

export const getLoansSchema = {
  query: {
    repaid: Joi.boolean(),
  },
};
