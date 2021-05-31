import Double from '@mongoosejs/double';
import { Schema, model } from 'mongoose';

const RepaymentSchema = new Schema({
  loanId: {
    type: Schema.Types.ObjectId,
    ref: 'Loan',
  },
  amount: {
    type: Double,
    required: true,
  },
});
