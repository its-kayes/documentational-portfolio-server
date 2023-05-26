import express from "express";
import cors from "cors";
import logger from "morgan";
// import helmet from "helmet";
import { v1 } from "./api-version/v1";
import { Request, Response, Application, NextFunction } from "express";
import AppError from "./utils/appError";

const app: Application = express();

const options: express.RequestHandler[] = [
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
  // helmet(),
  logger("dev"),
  express.json({ limit: "50mb" }),
  express.urlencoded({ extended: true }),
];

app.use(options);

app.use("/api/v1", v1);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/favicon.ico", (req, res) => {
  // Respond with an empty 204 status code
  res.sendStatus(204);
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

export default app;
