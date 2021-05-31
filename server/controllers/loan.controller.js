import Loan from '../database/models/Loan';
import { CustomError } from '../utils';

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
        return res.success(201, { Loan: newLoan });
      }

      res.error(400, {
        message: 'Exceeded maximum amount allowed',
        totalUnpaidAmount,
        newLoanTotal,
      });
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
      const filter = { userId };
      //user can filter loans []
      if (req.query.repaid) {
        filter['repaid'] = req.query.repaid;
      }
      const userId = req.user.id;
      const loans = await Loan.find({ userId });
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
        return res.success(200, { loan });
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
      const amount = req.query.amount;
      const tenor = req.query.tenor;

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
