import { Router, RequestHandler } from "express";
import { rateLimit } from "express-rate-limit";

import {
  register,
  login,
  updateUser,
  getUsers,
  logout,
} from "../controllers/authController.js";
import { authenticate, validateUserForm } from "../middleware/auth.js";

// security package - limit api calls in time
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests, please try later.", // response is straight string (429 Too Many Requests)
}); // 15 mins

const router = Router();

const homeRoute: RequestHandler = (req, res) => {
  res.send("Auth!");
};

router.get("/", homeRoute);

router.post("/register", apiLimiter, validateUserForm, register);
router.post("/login", apiLimiter, validateUserForm, login);
router.patch("/updateUser", authenticate, updateUser);
// logout (expire cookie)
router.get("/logout", logout);
// extra
router.get("/getUsers", getUsers);

export default router; // compiled to '.exports' by TS
