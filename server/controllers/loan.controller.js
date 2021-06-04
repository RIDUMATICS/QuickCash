import sendMail from '../config/email';
import Loan from '../database/models/Loan';
import Repayment from '../database/models/Repayment';
import { CustomError } from '../utils';
import messageTemplate from '../utils/messageTemplate';

export default class LoanController {
  /**
   * @method createLoan
   * @description Creates a loan application request
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async createLoan(req, res, next) {
    try {
      // get user id
      const userId = req.user.id;
      const { amount, tenor } = req.body;

      // User can only take a loan of up to 60% loan against his total portfolio value
      const maxAmount = (60 / 100) * req.user.getPortfolioValue();

      // calculate total unpaid amount (amount + interest)
      const totalUnpaidAmount = await Loan.calculateUnpaidLoans({ userId });

      // NOTE: loanTotal = ( amount + interest )
      const newLoanTotal = Loan.calculateTotal(amount, tenor);

      // check if totalUnpaidAmount + newLoanTotal is less or equal to max amount
      if (totalUnpaidAmount + newLoanTotal <= maxAmount) {
        let newLoan = new Loan({ userId, amount, tenor });
        newLoan = await newLoan.save();
        sendMail(
          req.user.email,
          'APPROVAL OF REQUEST FOR LOAN',
          messageTemplate.loanApproval(newLoan)
        );
        return res.success(201, { loan: newLoan });
      }

      sendMail(
        req.user.email,
        'REJECTION OF REQUEST FOR LOAN',
        messageTemplate.loanRejection()
      );
      throw new CustomError('Exceeded maximum amount allowed', 400);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method getLoans
   * @description View all his active loan and balance
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async getLoans(req, res, next) {
    try {
      const filter = { userId: req.user.id };

      if (req.query.repaid !== undefined) {
        filter['repaid'] = req.query.repaid;
      }

      const loans = await Loan.find(filter);
      res.success(200, { loans });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method getLoan
   * @description Retrieves a specific loan record by Id
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async getLoan(req, res, next) {
    try {
      const { id: userId } = req.user; //userId
      const { id: _id } = req.params; //loanId

      const loan = await Loan.findOne({ userId, _id });

      if (loan) {
        const repayments = await Repayment.find({ loanId: _id });
        return res.success(200, { loan: { ...loan.toJSON(), repayments } });
      }

      throw new CustomError('Loan not found', 404);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method getProratedPayment
   * @description View or get a prorated payment schedule over the loan period
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async getProratedPayment(req, res, next) {
    try {
      const { amount, tenor } = req.query;

      // calculate loan installment payment
      const installmentPayment = Loan.calculateInstallment(amount, tenor);

      //calculate loan total payment
      const total = Loan.calculateTotal(amount, tenor);

      //calculate loan interest
      const interest = Loan.calculateInterest(amount, tenor);
      amount, tenor;
      res.success(200, { amount, tenor, installmentPayment, interest, total });
    } catch (error) {
      next(error);
    }
  }
}
