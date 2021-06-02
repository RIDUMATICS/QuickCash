import Double from '@mongoosejs/double';
import { Schema, model } from 'mongoose';

const LoanSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  repaid: { type: Boolean, default: false },
  tenor: { type: Number, min: 6, max: 12, required: true },
  amount: { type: Double, required: true },
  installmentPayment: Double,
  totalPayment: Double,
  outstandingPayment: Double,
  interest: Double,
  repayments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Repayment',
    },
  ],
});

LoanSchema.statics.calculateUnpaidLoans = async function (data) {
  // calculate total unpaid amount (amount + interest)
  const unpaidLoans = await Loan.find({ ...data, repaid: false }).exec();
  const totalUnpaidAmount = unpaidLoans.reduce((amount, unpaidLoan) => {
    return amount + unpaidLoan.totalPayment;
  }, 0);

  return totalUnpaidAmount;
};

LoanSchema.statics.calculateInstallment = function (amount, tenor) {
  // interest rate is 24%
  const i = 24 / 100 / 12; // interest rate per month
  const n = tenor;
  const hold = Math.pow(1 + i, n); // for (1 + i)^n

  // calculate Loan installment payment
  // Formula is (amount * i(1 + i)^n)/((1 + i)^n - 1)
  let installmentPayment = (amount * i * hold) / (hold - 1);
  installmentPayment = Math.round(installmentPayment * 100) / 100; // convert to two decimal points
  return installmentPayment;
};

LoanSchema.statics.calculateTotal = function (amount, tenor) {
  const installmentPayment = Loan.calculateInstallment(amount, tenor);
  // Total is installmentPayment * tenor
  let total = installmentPayment * tenor;
  total = Math.round(total * 100) / 100; //convert to two decimal points
  return total;
};

LoanSchema.statics.calculateInterest = function (amount, tenor) {
  const total = Loan.calculateTotal(amount, tenor);

  // interest paid is calculated by subtracting the loan amount from the total amount
  let interest = total - amount;
  interest = Math.round(interest * 100) / 100;
  return interest;
};

LoanSchema.methods.toJSON = function () {
  const loan = this.toObject();
  delete loan.repayments;
  return loan;
};

LoanSchema.pre('save', function (next) {
  // if it is a new Loan
  if (this.isNew) {
    // calculate loan installment payment
    this.installmentPayment = Loan.calculateInstallment(
      this.amount,
      this.tenor
    );

    //calculate loan total payment
    this.totalPayment = Loan.calculateTotal(this.amount, this.tenor);
    this.outstandingPayment = this.totalPayment;

    //calculate loan interest
    this.interest = Loan.calculateInterest(this.amount, this.tenor);
  }
  next();
});

const Loan = model('Loan', LoanSchema);
export default Loan;
