import dotenv from 'dotenv';

// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

export default {
  port: process.env.PORT || 4200,
  secret: process.env.SECRET || 'secret',
  mongoURI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV,
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
};
