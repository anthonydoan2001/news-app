import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import newsRoutes from "./routes/newsRoutes.js";
import { fetchAndStoreNews } from "./controllers/newsController.js";
import { createTable } from "./models/newsModel.js";
import cron from "node-cron";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/news", newsRoutes);

// Create Database Table
createTable().then(() => console.log("✅ Database ready."));

// Schedule news updates every 30 minutes
cron.schedule("*/30 * * * *", () => {
  console.log("⏳ Fetching latest news...");
  fetchAndStoreNews();
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
