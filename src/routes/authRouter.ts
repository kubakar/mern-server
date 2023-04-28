import { Router, RequestHandler } from "express";

import {
  register,
  validateUserForm,
  login,
  updateUser,
  getUsers,
  authenticate,
} from "../controllers/authController.js";
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
