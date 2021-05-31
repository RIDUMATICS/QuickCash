import { Schema, model } from 'mongoose';
import Double from '@mongoosejs/double';
// named export
export const PortfolioSchema = new Schema(
  {
    symbol: {
      type: String,
      required: true,
    },
    totalQuantity: {
      type: Double,
      required: true,
    },
    equityValue: {
      type: Double,
      required: true,
    },
    pricePerShare: {
      type: Double,
      required: true,
    },
  },
  { timestamps: false }
);
