import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import issueRoutes from './routes/issueRoutes.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Routes
app.use("/api/issues", issueRoutes);

app.get("/", (req, res) => {
  res.send("Server is running. Navigate to /api/issues for API routes.");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});