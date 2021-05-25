import dotenv from 'dotenv';

// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

export default {
  port: process.env.PORT,
  mongoURI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV,
};
