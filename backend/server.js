import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "taskflow-api" });
});

app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const start = async () => {
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI is not set");
    const host = await connectDB(MONGO_URI);
    console.log(`[db] connected: ${host}`);
    app.listen(PORT, () => console.log(`[api] listening on :${PORT}`));
  } catch (err) {
    console.error("[startup] failed:", err.message);
    process.exit(1);
  }
};

start();
