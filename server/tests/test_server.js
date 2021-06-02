import http from 'http';
import app from '../loaders';
import { Logger } from '../utils';

const testServer = http.createServer(app);

const PORT = 5555;

// using different port for test
testServer.listen(PORT, () => Logger.info(`Test running on port: ${PORT}`));

export default testServer;
