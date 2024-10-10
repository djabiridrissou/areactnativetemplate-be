import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const dbURI = process.env.DB_URI!;
    await mongoose.connect(dbURI);
    console.log('=== Database connected ===');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
