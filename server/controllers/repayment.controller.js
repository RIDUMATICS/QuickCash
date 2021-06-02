import Loan from '../database/models/Loan';
import { CustomError, Logger } from '../utils';
import paystack from '../config/paystack';
import Repayment from '../database/models/Repayment';

export default class RepaymentController {
  /**
   * @method postRepayment
   * @description - User can payback his loan through Paystack
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async postRepayment(req, res, next) {
    try {
      const { id: userId, email } = req.user;
      const { id: loanId } = req.params;
      const loan = await Loan.findOne({ _id: loanId, userId });

      if (loan) {
        // if loan is fully repaid don't create repayment
        if (loan.repaid) {
          throw new CustomError('Loan has been fully paid', 422);
        }

        const paidAmount = loan.installmentPayment.value;
        // payment using paystack
        const resp = await paystack.initialize({
          amount: paidAmount,
          email,
          loanId,
        });

        return res.success(201, { ...resp });
      }

      throw new CustomError('Loan not found', 404);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method postRepayment
   * @description - Verify paystack payment
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async verifyPayment(req, res, next) {
    try {
      const { ref } = req.body;
      //verify payment using paystack api
      const {
        data: { status, paid_at, amount, metadata, gateway_response },
      } = await paystack.verify({ ref });

      let repayment;

      if (status === 'success') {
        // check if repayment with the same ref existed
        repayment = await Repayment.findOne({ ref });

        // if repayment not found (new repayment)
        if (!repayment) {
          const amountNaira = amount / 100; //convert amount to naira

          repayment = await Repayment.create({
            amount: amountNaira,
            loanId: metadata.loanId,
            paid_at,
            ref,
          });
        }
      }

      res.success(200, { message: gateway_response, repayment });
    } catch (error) {
      next(error);
    }
  }
}
