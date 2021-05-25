import mongoose from 'mongoose';
import config from '.';

export default async () => {
  const connection = await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  return connection.connection.db;
};
