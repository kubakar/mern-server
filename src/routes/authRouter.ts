import express, { Router, RequestHandler } from "express";
import { register, login, updateUser } from "../controllers/authController.js";
const router = Router();

const homeRoute: RequestHandler = (req, res) => {
  res.send("Auth!");
};

router.get("/", homeRoute);

router.post("/register", register);
router.post("/login", login);
router.patch("/updateUser", updateUser);

export default router; // compiled to '.exports' by TS
