import express from "express";
import {
   addVideo,
   addview,
   deleteVideo,
   getBySearch,
   getByTags,
   getChannelVideo,
   getVideo,
   random,
   sub,
   trend,
   updateVideo,
} from "../controllers/videoController.js";
import { verifyToken } from "./../verifyToken.js";

const router = express.Router();

//create a video
router.post("/", verifyToken, addVideo);
//update video
router.put("/:id", verifyToken, updateVideo);
//delete video
router.delete("/:id", verifyToken, deleteVideo);
//get video
router.get("/find/:id", getVideo);
//get all channel video
router.get("/find/channelvideo/:id", getChannelVideo);
//add view
router.get("/view/:id", addview);
//trend video
router.get("/trend", trend);
//random video
router.get("/random", random);
//sub video
router.get("/sub", verifyToken, sub);
//get by tags video
router.get("/tags", getByTags);
//get by search video
router.get("/search", getBySearch);

export default router;
