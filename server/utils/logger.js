import { transports, createLogger, format, addColors } from 'winston';
import 'winston-mongodb';
import config from '../config';

const { combine, timestamp, errors, json, printf, colorize, metadata } = format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
});

//
// If we're in production then log error to mongoDB database:
//
const Logger = createLogger({
  levels,
  transports: [
    new transports.MongoDB({
      level: 'error',
      db: config.mongoURI,
      options: { useUnifiedTopology: true },
      collection: 'logs',
      format: combine(timestamp(), errors({ stack: true }), metadata(), json()),
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message}`
//
if (config.NODE_ENV !== 'production') {
  Logger.add(
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      format: combine(
        colorize({ all: true }),
        metadata(),
        errors({ stack: true }),
        printf(({ level, message }) => {
          // formating the log outcome
          return `${level}: ${message}`;
        })
      ),
    })
  );
}

export default Logger;
