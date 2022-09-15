import mongoose from "mongoose";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { createError } from "./../error.js";
import jwt from "jsonwebtoken";

//sign up
export const signup = async (req, res, next) => {
   try {
      const salt = bcrypt.genSaltSync(10);
      const hasPass = bcrypt.hashSync(req.body.password, salt);
      const newUser = new UserModel({ ...req.body, password: hasPass });
      await newUser.save();
      res.status(200).json("user created successfully");
   } catch (error) {
      next(error);
   }
};

//signin
export const signin = async (req, res, next) => {
   try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) return next(createError(404, "user not found!"));
      const isCorrect = await bcrypt.compare(req.body.password, user.password);
      if (!isCorrect) return next(createError(400, "wrong creadsintial!"));
      const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);

      const { password, ...other } = user._doc;

      res.status(200).json({ ...other, token });
   } catch (error) {
      next(error);
   }
};

//google signin

export const googleSignin = async (req, res, next) => {
   try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (user) {
         const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
         res.cookie("access_token", token, {
            httpOnly: true,
         })
            .status(200)
            .json(user._doc);
      } else {
         const newUser = new UserModel({ ...req.body, fromGoogle: true });
         const savedUser = await newUser.save();
         const token = jwt.sign({ id: savedUser._id }, process.env.JWT_KEY);
         res.cookie("access_token", token, {
            httpOnly: true,
         })
            .status(200)
            .json(savedUser._doc);
      }
   } catch (error) {
      next(error);
   }
};
