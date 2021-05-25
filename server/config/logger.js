import { transports, createLogger, format, addColors } from 'winston';
import 'winston-mongodb';
import config from '.';

const { combine, timestamp, errors, json, printf, colorize } = format;

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
const logger = createLogger({
  levels,
  transports: [
    new transports.MongoDB({
      level: 'error',
      db: config.mongoURI,
      options: { useUnifiedTopology: true },
      collection: 'quickcash',
      format: combine(timestamp(), errors(), json()),
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message}`
//
if (config.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      format: combine(
        colorize({ all: true }),
        printf((info) => `${info.level}: ${info.message}`)
      ),
    })
  );
}

export default logger;
