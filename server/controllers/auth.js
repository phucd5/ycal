import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  handleNotFound,
  handleServerError,
  handleSuccess,
  handleBadRequest,
} from "../utils/query_response.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const savedUser = await newUser.save();
    handleSuccess(res, savedUser);
  } catch (err) {
    handleServerError(res, err);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return handleNotFound(res);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return handleBadRequest("Password/Email is incorrect");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    handleSuccess(res, { token, user });
  } catch (err) {
    handleServerError(res, err);
  }
};
