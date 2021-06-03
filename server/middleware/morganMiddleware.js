import morgan from 'morgan';
import config from '../config';
import { Logger } from '../utils';

const stream = {
  write: (message) => Logger.http(message),
};

// should not log route in test mode
const skip = () => config.NODE_ENV === 'test';

const morganMiddleware = morgan(
  // Define message format string
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

export default morganMiddleware;
