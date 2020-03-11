import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

class Database {
  constructor() {
    this.conn = mongoose.connect(process.env.MONGO_DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database().conn;
