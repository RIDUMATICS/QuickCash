import { celebrate } from 'celebrate';
import { Router } from 'express';
import passport from 'passport';
import LoanController from '../controllers/loan.controller';
import RepaymentController from '../controllers/repayment.controller';
import {
  createLoanSchema,
  getLoansSchema,
  getProratedPaymentSchema,
} from '../validation/loanSchema';

const route = Router();

const opt = { abortEarly: false }; // Joi validation options

export default (app) => {
  app.use('/loans', route);

  route.get(
    '/calculate',
    celebrate(getProratedPaymentSchema, opt),
    LoanController.getProratedPayment
  );

  route.post(
    '/',
    celebrate(createLoanSchema, opt),
    passport.authenticate('jwt', { session: false }),
    LoanController.createLoan
  );

  route.get(
    '/',
    celebrate(getLoansSchema, opt),
    passport.authenticate('jwt', { session: false }),
    LoanController.getLoans
  );

  route.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    LoanController.getLoan
  );

  route.post(
    '/repayment/verify',
    passport.authenticate('jwt', { session: false }),
    RepaymentController.verifyPayment
  );

  route.post(
    '/repayment/:id',
    passport.authenticate('jwt', { session: false }),
    RepaymentController.postRepayment
  );
};
