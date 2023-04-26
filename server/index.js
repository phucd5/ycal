import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import eventRoutes from "./routes/events.js";
import yClassRoutes from "./routes/yclass.js";
import yClassEventRoutes from "./routes/yclassevents.js";

// Boilerplate Configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
	cors({
		origin: ["*"],
	})
);

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// MongoDB Setup
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/yclasses", yClassRoutes);
app.use("/yclassevents", yClassEventRoutes);

//MongoDB database
const PORT = process.env.PORT || 6001;
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		app.listen(PORT, () =>
			console.log(`Connected to Database at Port: ${PORT}`)
		);
	})
	.catch((error) => console.log(`${error}`));
