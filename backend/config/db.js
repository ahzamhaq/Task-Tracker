import mongoose from "mongoose";

const MAX_RETRIES = 10;
let retries = 0;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const connectDB = async (uri) => {
  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => {
    retries = 0;
    console.log(`[db] connected: ${mongoose.connection.host}`);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("[db] disconnected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("[db] error:", err.message);
  });

  const tryConnect = async () => {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 20,
        retryWrites: true,
      });
    } catch (err) {
      retries += 1;
      const delay = Math.min(30000, 1000 * 2 ** retries);
      console.error(
        `[db] connection attempt ${retries} failed (${err.message}). retrying in ${delay}ms…`
      );
      if (retries >= MAX_RETRIES) throw err;
      await wait(delay);
      await tryConnect();
    }
  };

  await tryConnect();
  return mongoose.connection.host;
};
