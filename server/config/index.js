import dotenv from 'dotenv';

// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

export default {
  port: process.env.PORT || 4200,
  secret: process.env.SECRET || 'secret',
  DB_URL: process.env.DB_URL,
  TESTDB_URL: process.env.TESTDB_URL,
  TEST_COLLECTION: process.env.TEST_COLLECTION,
  NODE_ENV: process.env.NODE_ENV,
  PAYSTACK_PROD_KEY: process.env.PAYSTACK_PROD_KEY, // for production
  PAYSTACK_TEST_KEY: process.env.PAYSTACK_TEST_KEY, // for development and testing
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
};
