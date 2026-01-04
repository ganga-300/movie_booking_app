import mongoose from 'mongoose';

let isConnected = false; // Track connection across requests

const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Using existing database connection');
    return;
  }

  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/QuickShow`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('✅ Database Connected');
  } catch (error) {
    console.error('❌ DB connection error:', error.message);
    throw error;
  }
};

export default connectDB;
