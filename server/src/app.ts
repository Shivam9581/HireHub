import express from "express";
import cors from "cors";
import env from "./config/env";
import authRouter from "./routes/auth.routes";
import errorHandler from "./middlewares/error.middleware";
import jobRouter from "./routes/job.routes";
import applicationRouter from "./routes/application.routes";
import userRoutes from "./routes/user.routes"
import { config } from "dotenv";


const app = express();

app.use(cors({
    origin: env.FRONTEND_URL, 
}));

app.use(express.json());


app.get("/", (_, res) => {
    res.send("HireHub API is running");
});


app.use("/api/auth", authRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRouter);

app.use("/api/users", userRoutes)

app.use(errorHandler); 

export default app;


