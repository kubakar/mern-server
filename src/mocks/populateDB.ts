import dotenv from "dotenv";
import { readFile } from "fs/promises";
import Job from "../models/Job.js";
import connectDB from "../db/connect.js";

console.clear();
dotenv.config({ path: "../../.env" }); // need to add path in nested folder

try {
  console.log(process.env.MONGO_PASSWORD);

  await connectDB();
  await Job.deleteMany(); // delete all

  const jsonJobs = await readFile(
    // this is how path is constructed in ES modules
    // https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
    new URL("../../src/mocks/mock-data.json", import.meta.url) // by default TS will read 'dist' directory
    // relative path from 'dist' !
  );

  const jobs = JSON.parse(jsonJobs.toString());

  await Job.create(jobs); // array can be passed
  console.log("DONE");

  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
