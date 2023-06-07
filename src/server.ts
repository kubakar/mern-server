import express, { Request, Response } from "express";

import "dotenv/config";

import morgan from "morgan";

// handle static files + client app
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// security packages
import helmet from "helmet";

import connectDB from "./db/connect.js";

// import homeRouter from "./routes/homeRouter.js";

import authRouter from "./routes/authRouter.js";
import jobRouter from "./routes/jobRouter.js";
import { errorMiddleware, notFoundMiddleware } from "./middleware/main.js";
import { authenticate } from "./middleware/auth.js";

// dotenv.config(); // not needed in ES6 modules approach

const app = express();

// security packages
app.use(helmet());
// rateLimit applied only to authRouter

// json middleware
app.use(express.json());

// handle static files + client app
// extra code in order to handle ES6 modules
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "../build-client"))); // same relative as from 'dist' folder - OK

// morgan logger
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// app.use("/", homeRouter);

app.use("/api/auth", authRouter);
app.use("/api/job", authenticate, jobRouter); // middleware applied to all subroutes

// CLIENT APP ROUTING...
// route all GET request to client app so they are handled by React Router
app.get("*", (req: Request, res: Response) =>
  // */
  res.sendFile(path.resolve(__dirname, "../build-client", "index.html"))
);
// ...CLIENT APP ROUTING

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
