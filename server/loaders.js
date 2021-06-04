import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import morgan from './middleware/morganMiddleware';
import routes from './routes';
import { CustomError, Logger } from './utils';
import { isCelebrateError } from 'celebrate';
import responseMiddleware from './middleware/responseMiddleware';
import passportConfig from './config/passport';

const app = express();

// Enable Cross Origin Resource Sharing to all origins by default
app.use(cors());

// Helmet helps you secure your Express apps by setting various HTTP headers
app.use(helmet());

// Middleware that transforms the raw string of req.body into json
app.use(express.json());

// Middleware that add new methods (error & success) to res object
app.use(responseMiddleware);

app.use(morgan);

app.use(passport.initialize());

passportConfig(passport);

// Load API routes
app.use('/api/v1', routes());

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new CustomError('Not Found', 404);
  next(err);
});

/// error handlers for celebrate validation
app.use((err, req, res, next) => {
  // If this isn't a Celebrate error, send it to the next error handler
  if (!isCelebrateError(err)) {
    return next(err);
  }

  // converting map to array
  let messages = [];

  for (let value of err.details.values()) {
    console.log(value.details);
    messages = value.details.map(({ message }) => message);
  }
  res.error(400, messages);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;

  if (status >= 500) {
    // If  error is 5xx it should log the error to database
    Logger.error(err.message, { status, stack: err.stack });
  }

  res.error(status, [err.message]);
});

export default app;
