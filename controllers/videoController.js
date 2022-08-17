import VideoModel from "../models/VideoModel.js";
import { createError } from "./../error.js";
import UserModel from "../models/UserModel.js";

//create a video
export const addVideo = async (req, res, next) => {
   const newVideo = new VideoModel({ userId: req.user.id, ...req.body });
   try {
      const savedVideo = await newVideo.save();
      res.status(200).json(savedVideo);
   } catch (error) {
      next(error);
   }
};

//update video
export const updateVideo = async (req, res, next) => {
   try {
      const video = await VideoModel.findById(req.params.id);
      if (!video) return next(createError(404, "video not found"));
      if (req.user.id === video.userId) {
         const updatedVideo = await VideoModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.$set },
            { new: true }
         );
         res.status(200).json(updatedVideo);
      } else {
         return next(createError(403, "you can updated only your video"));
      }
   } catch (error) {
      next(error);
   }
};

//delete video
export const deleteVideo = async (req, res, next) => {
   try {
      const video = await VideoModel.findById(req.params.id);
      if (!video) return next(createError(404, "video not found"));
      if (req.user.id === video.userId) {
         await VideoModel.findByIdAndDelete(req.params.id);
         res.status(200).json("video has been deleted successfully");
      } else {
         return next(createError(403, "you can delete only your video"));
      }
   } catch (error) {
      next(error);
   }
};

//get video
export const getVideo = async (req, res, next) => {
   try {
      const video = await VideoModel.findById(req.params.id);
      res.status(200).json(video);
   } catch (error) {
      next(error);
   }
};

//add view
export const addview = async (req, res, next) => {
   try {
      await VideoModel.findById(req.params.id, { $inc: { views: 1 } });
      res.status(200).json("the view has been increesed");
   } catch (error) {
      next(error);
   }
};

//random
export const random = async (req, res, next) => {
   try {
      const videos = await VideoModel.aggregate([{ $sample: { size: 40 } }]);
      res.status(200).json(videos);
   } catch (error) {
      next(error);
   }
};

//trend
export const trend = async (req, res, next) => {
   try {
      const videos = await VideoModel.find().sort({ views: -1 });
      res.status(200).json(videos);
   } catch (error) {
      next(error);
   }
};

//sub
export const sub = async (req, res, next) => {
   try {
      const user = await UserModel.findById(req.user.id);
      const subscribedChnnels = user.subscribedUsers;
      const list = await Promise.all(
         subscribedChnnels.map((channelId) => {
            return VideoModel.find({ userId: channelId });
         })
      );
      res.status(200).json(
         list.flat().sort((a, b) => b.createdAt - a.createdAt)
      );
   } catch (error) {
      next(error);
   }
};

//get by tags
export const getByTags = async (req, res, next) => {
   const tags = req.query.tags.split(",");
   try {
      const videos = await VideoModel.find({ tags: { $in: tags } }).limit(20);
      res.status(200).json(videos);
   } catch (error) {
      next(error);
   }
};

//get by Search
export const getBySearch = async (req, res, next) => {
   const query = req.query.q;
   try {
      const videos = await VideoModel.find({
         tittle: { $regex: query, $options: "i" },
      }).limit(40);
      res.status(200).json(videos);
   } catch (error) {
      next(error);
   }
};
