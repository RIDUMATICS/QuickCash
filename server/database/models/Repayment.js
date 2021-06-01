import Double from '@mongoosejs/double';
import { Schema, model } from 'mongoose';
import Loan from './Loan';

const RepaymentSchema = new Schema({
  loanId: {
    type: Schema.Types.ObjectId,
    ref: 'Loan',
  },
  amount: {
    type: Double,
    required: true,
  },
  paid_at: Date,
  ref: {
    type: String,
    unique: true,
    required: true,
  },
});

RepaymentSchema.post('save', async function (repayment) {
  // find loan paid for
  const loan = await Loan.findOne({ _id: repayment.loanId });

  // minus amount from outstanding payment
  const outstandingPayment = loan.outstandingPayment - repayment.amount;
  loan.outstandingPayment = Math.round(outstandingPayment * 100) / 100;

  // if there is no outstanding payment
  if (loan.outstandingPayment.value === 0) {
    loan.repaid = true;
  }

  // insert the new repayment in repayments field
  // corresponding to the loan we found in database
  loan.repayments.push(repayment._id);
  await loan.save();
});

export default model('Repayment', RepaymentSchema);
