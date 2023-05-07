import { Router } from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  showStats,
  updateJob,
} from "../controllers/jobsController.js";
import { validateJobsForm } from "../middleware/jobs.js";

const router = Router();

router.route("/").post(validateJobsForm, createJob).get(getAllJobs);

// has to be place before :id
router.get("/stats", showStats);

router.route("/:id").delete(deleteJob).patch(validateJobsForm, updateJob);

export default router; // compiled to '.exports' by TS
