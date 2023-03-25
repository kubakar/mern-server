import express, { Request, Response, NextFunction } from "express";
import router, {
  notFoundMiddleware,
  errorMiddleware,
} from "./routes/router.js";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.PORT2);

const app = express();

// app.get("/", (req: express.Request, res: express.Response) => {
//   res.send("Welcome!");
// });

app.use("/", router);

// no route taken, so there is a 404
app.use(notFoundMiddleware);
// error handler
app.use(errorMiddleware);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
