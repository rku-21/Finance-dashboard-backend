import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import recordRoutes from "./routes/record.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import userRoutes from "./routes/user.routes.js";
import { apiLimiter, authLimiter } from "./utils/rateLimiter.js";

dotenv.config();
export const app = express();
export const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/auth", authLimiter, authRoutes);
app.use("/records", apiLimiter, recordRoutes);
app.use("/dashboard", apiLimiter, dashboardRoutes);
app.use("/users", userRoutes);


app.get("/", (req, res) => {
	res.send(
		"backend server is running Use /auth, /users, /records, /dashboard endpoints"
	);
});
