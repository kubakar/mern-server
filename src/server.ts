import express, { Request, Response, NextFunction } from "express";
import homeRouter, {
  notFoundMiddleware,
  errorMiddleware,
} from "./routes/homeRouter.js";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import authRouter from "./routes/authRouter.js";
import jobRouter from "./routes/jobRouter.js";

dotenv.config();

const app = express();

// json middleware
app.use(express.json());

app.use("/", homeRouter);
app.use("/api/auth", authRouter);
app.use("/api/job", jobRouter);

// no route taken, so there is a 404
app.use(notFoundMiddleware);
// error handler
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  connectDB()
    .then(() => {
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}`)
      );
    })
    .catch((error) => console.log(error));
};

start();
