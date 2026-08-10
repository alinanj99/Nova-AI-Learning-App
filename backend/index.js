import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import nasaRoutes from "./routes/nasaRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

app.use("/api/nasa", nasaRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Nova API is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});