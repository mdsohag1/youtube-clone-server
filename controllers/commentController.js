import { createError } from "../error.js";
import CommentModel from "../models/CommentModel.js";
import VideoModel from "../models/VideoModel.js";

//add comment
export const addComment = async (req, res, next) => {
   const newComment = new CommentModel({ ...req.body, userId: req.user.id });
   try {
      const savedComment = await newComment.save();
      res.status(200).json(savedComment);
   } catch (error) {
      next(error);
   }
};
//delete comment
export const deleteComment = async (req, res, next) => {
   try {
      const comment = await CommentModel.findById(req.params.id);
      const video = await VideoModel.findById(req.params.id);
      if (req.user.id === comment.userId || req.user.id === video.userId) {
         await CommentModel.findByIdAndDelete(req.params.id);
         res.status(200).json("comment has been deleted successfully");
      } else {
         return next(createError(403, "you can deleted only your comments"));
      }
   } catch (error) {
      next(error);
   }
};
//all comments
export const getComments = async (req, res, next) => {
   try {
      const comments = await CommentModel.find({ videoId: req.params.videoId });
      res.status(200).json(comments);
   } catch (error) {
      next(error);
   }
};
