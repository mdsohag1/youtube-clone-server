import { createError } from "../error.js";
import UserModel from "../models/UserModel.js";
import VideoModel from "../models/VideoModel.js";

//update user
export const updateUser = async (req, res, next) => {
   if (req.params.id === req.user.id) {
      try {
         const updateUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
         );
         res.status(200).json(updateUser);
      } catch (error) {
         next(error);
      }
   } else {
      next(createError(403, "you update only your account"));
   }
};

//delete user
export const deleteUser = async (req, res, next) => {
   if (req.params.id === req.user.id) {
      try {
         await UserModel.findByIdAndDelete(req.params.id);
         res.status(200).json("user has been deleted");
      } catch (error) {
         next(error);
      }
   } else {
      next(createError(403, "you delete only your account"));
   }
};

//get a user
export const getAUser = async (req, res, next) => {
   try {
      const user = await UserModel.findById(req.params.id);
      const { password, email, ...other } = user._doc;
      res.status(200).json(other);
   } catch (error) {
      next(error);
   }
};

//subscribe a user
export const subscribe = async (req, res, next) => {
   try {
      await UserModel.findByIdAndUpdate(req.user.id, {
         $push: { subscribedUsers: req.params.id },
      });
      await UserModel.findByIdAndUpdate(req.params.id, {
         $inc: { subscriber: 1 },
      });
      res.status(200).json("subscription sucessfull");
   } catch (error) {
      next(error);
   }
};

//unsubscribe a user
export const unSubscribe = async (req, res, next) => {
   try {
      await UserModel.findByIdAndUpdate(req.user.id, {
         $pull: { subscribedUsers: req.params.id },
      });
      await UserModel.findByIdAndUpdate(req.params.id, {
         $inc: { subscriber: -1 },
      });
      res.status(200).json("unsubscription sucessfull");
   } catch (error) {
      next(error);
   }
};

//like a video
export const likeVideo = async (req, res, next) => {
   const id = req.user.id;
   const videoId = req.params.videoId;
   try {
      await VideoModel.findByIdAndUpdate(videoId, {
         $addToSet: { likes: id },
         $pull: { dislikes: id },
      });
      res.status(200).json("the video hasbeen liked");
   } catch (error) {
      next(error);
   }
};

//unlike a video
export const unLikeVideo = async (req, res, next) => {
   const id = req.user.id;
   const videoId = req.params.videoId;
   try {
      await VideoModel.findByIdAndUpdate(videoId, {
         $addToSet: { dislikes: id },
         $pull: { likes: id },
      });
      res.status(200).json("the video hasbeen liked");
   } catch (error) {
      next(error);
   }
};
