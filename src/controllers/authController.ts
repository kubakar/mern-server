import { RequestHandler } from "express";

import User, { UserInterface } from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../utils/error.js";
import { attachCookie } from "../utils/auxMethods.js";

// controllers
export const register: RequestHandler<object, object, UserInterface> = async (
  req,
  res,
  next
) => {
  const { body } = req; // type assigned with 'RequestHandler' generic (UserInterface)

  try {
    const user = await User.create(body);

    // do not send token in register - individual approach
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...partialUser } = user.toObject(); // do not send password

    res.status(StatusCodes.CREATED).json({
      user: partialUser,
    });
  } catch (e) {
    next(e); // pass error to express error handler
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password"); // password is hidden by default

    if (!user)
      throw new CustomAPIError(
        "Invalid Credentials (no such user)", // throw custom error
        StatusCodes.UNAUTHORIZED
      );

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid)
      throw new CustomAPIError(
        "Invalid Credentials (invalid pass)", // throw custom error
        StatusCodes.UNAUTHORIZED
      );

    // 'toObject()' is necessary in order to get only keys (not Document object)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...partialUser } = user.toObject(); // do not send password

    const token = user.createJWT(); // setup the token

    // auth with 'cookies'
    attachCookie(res, token);

    res.status(StatusCodes.OK).json({
      user: partialUser,
      // token, // removed now
      tokenSent: true,
    });
  } catch (e) {
    next(e);
  }
};

// when token is passed via cookie, it's important to kill/expire that cookie when logging out
export const logout: RequestHandler = async (req, res) => {
  res.cookie("token", "LOGOUT", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000), // + 1s
  });

  console.log("SERVER LOGOUT OK");
  res.status(StatusCodes.OK).json({ msg: "User logged out!" });
};

export const updateUser: RequestHandler<object, object, UserInterface> = async (
  req,
  res,
  next
) => {
  console.log(req.user); // user is already appended at this point

  const { email, name, lastName, location } = req.body;

  try {
    const user = await User.findOne({ _id: req.user.userId });

    if (!user)
      throw new CustomAPIError(
        "Invalid Credentials (no such user / updating)", // throw custom error
        StatusCodes.UNAUTHORIZED
      );

    user.email = email;
    user.name = name;
    user.lastName = lastName || "Def. Surname (new)";
    user.location = location || "My city (new)";

    // save to DB
    await user.save();

    // this not mandatory (only ID is signed in JWT) but now we will re-generate the token including expiration
    const token = user.createJWT(); // setup the token

    // auth with 'cookies'
    attachCookie(res, token);

    res.status(StatusCodes.OK).json({
      user,
      // token, // removed now
      tokenSent: true,
    });
  } catch (e) {
    next(e);
  }
};

export const getUsers: RequestHandler = async (req, res, next) => {
  // https://expressjs.com/en/guide/error-handling.html

  try {
    const users = await User.find(); // get all users

    setTimeout(() => {
      res.status(StatusCodes.OK).json(users);
    }, 2000);
  } catch (e) {
    next(e); // pass error to express error handler
  }
};
