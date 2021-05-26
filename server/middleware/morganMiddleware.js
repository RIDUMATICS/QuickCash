import morgan from 'morgan';
import { Logger } from '../utils';

const stream = {
  write: (message) => Logger.http(message),
};

const morganMiddleware = morgan(
  // Define message format string
  ':method :url :status :res[content-length] - :response-time ms',
  { stream }
);

export default morganMiddleware;
