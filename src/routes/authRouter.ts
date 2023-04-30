import { Router, RequestHandler } from "express";

import {
  register,
  login,
  updateUser,
  getUsers,
} from "../controllers/authController.js";
import { authenticate, validateUserForm } from "../middleware/auth.js";
const router = Router();

const homeRoute: RequestHandler = (req, res) => {
  res.send("Auth!");
};

router.get("/", homeRoute);

router.post("/register", validateUserForm, register);
router.post("/login", validateUserForm, login);
router.patch("/updateUser", authenticate, updateUser);
// extra
router.get("/getUsers", getUsers);

export default router; // compiled to '.exports' by TS
