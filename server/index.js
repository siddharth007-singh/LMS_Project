import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './database/db.js';
import userRouter from './routes/user.route.js';
import courceRouter from './routes/cource.route.js';
import mediaRoute from './routes/media.route.js';
import PurchaseRoute from "./routes/purchaseCource.route.js";
dotenv.config({});

connectDB();

const app = express();
const PORT = process.env.PORT;

//require middleare
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));

//apis calling
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/cource", courceRouter);
app.use("/api/v1/purchase", PurchaseRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 