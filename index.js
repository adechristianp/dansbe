import express from "express";
import dotenv from "dotenv";
import db from "./config/Database.js";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const port = 7072;

try {
    await db.authenticate();
    console.log("Database connected");
} catch (error) {
    console.log("Database error: ", error)
}

app.use(cors({credentials: true, origin: 'http://127.0.0.1:3000'}))
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(port, () => console.log(`Server running on port ${port}`));