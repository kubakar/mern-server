import express from "express";

import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./db/connect.js";

import homeRouter from "./routes/homeRouter.js";

import authRouter from "./routes/authRouter.js";
import jobRouter from "./routes/jobRouter.js";
import { errorMiddleware, notFoundMiddleware } from "./middleware/main.js";
import { authenticate } from "./middleware/auth.js";

dotenv.config();

const app = express();

// json middleware
app.use(express.json());

// morgan logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/", homeRouter);
app.use("/api/auth", authRouter);
app.use("/api/job", authenticate, jobRouter); // middleware applied to all subroutes

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
