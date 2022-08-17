import express from "express";
import {
   deleteUser,
   getAUser,
   likeVideo,
   subscribe,
   unLikeVideo,
   unSubscribe,
   updateUser,
} from "../controllers/userController.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

//update user
router.put("/:id", verifyToken, updateUser);

//delete user
router.delete("/:id", verifyToken, deleteUser);

//get a user
router.get("/find/:id", getAUser);

//subscribe a user
router.put("/sub/:id", verifyToken, subscribe);

//unsubscribe a user
router.put("/unsub/:id", verifyToken, unSubscribe);

//like a video
router.put("/like/:videoId", verifyToken, likeVideo);

//unlike a video
router.put("/unlike/:videoId", verifyToken, unLikeVideo);

export default router;
