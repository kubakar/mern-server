import express, { Router, RequestHandler } from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  showStats,
  updateJob,
} from "../controllers/jobsController.js";
createJob;
const router = Router();

router.route("/").post(createJob).get(getAllJobs);

// has to be place before :id
router.get("/stats", showStats);

router.route("/:id").delete(deleteJob).patch(updateJob);

export default router; // compiled to '.exports' by TS
