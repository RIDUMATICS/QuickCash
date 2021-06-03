import axios from 'axios';
import config from '.';

// It will not make payment to live account in test mode
const SECRET_KEY =
  config.NODE_ENV === 'production'
    ? config.PAYSTACK_PROD_KEY
    : config.PAYSTACK_TEST_KEY;

const axiosInstance = axios.create({
  baseURL: 'https://api.paystack.co/transaction',
  headers: {
    Authorization: `Bearer ${SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

const paystack = {
  initialize: async ({ amount, email, loanId }) => {
    try {
      // paystack charge amount is in kobo
      amount = amount * 100;

      const { data } = await axiosInstance.post('/initialize', {
        amount,
        email,
        metadata: {
          loanId,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  verify: async ({ ref }) => {
    try {
      const { data } = await axiosInstance.get(`/verify/${ref}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default paystack;
