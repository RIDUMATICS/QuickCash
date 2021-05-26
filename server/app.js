import config from './config';
import app from './loaders';
import { Logger } from './utils';
import mongoConnect from './config/mongoose';

const PORT = config.port;

(async () => {
  try {
    await mongoConnect();
    Logger.info('✌️ DB connected successfully!');
    app.listen(PORT, () =>
      Logger.info(`Server listening on port: ${config.port}`)
    );
  } catch (err) {
    Logger.error(err.message, { path: 'app.js' });
    process.exit(1);
  }
})();
