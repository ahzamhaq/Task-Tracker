import mongoose from "mongoose";

export const connectDB = async (uri) => {
  mongoose.set("strictQuery", true);
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  });
  return conn.connection.host;
};
