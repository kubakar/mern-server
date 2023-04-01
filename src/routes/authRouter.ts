import express, { Router, RequestHandler } from "express";
import {
  register,
  validateRegister,
  login,
  updateUser,
  getUsers,
} from "../controllers/authController.js";
const router = Router();

const homeRoute: RequestHandler = (req, res) => {
  res.send("Auth!");
};

router.get("/", homeRoute);

router.post("/register", validateRegister, register);
router.post("/login", login);
router.patch("/updateUser", updateUser);
router.get("/getUsers", getUsers);

export default router; // compiled to '.exports' by TS
