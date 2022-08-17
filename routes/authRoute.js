import express from "express";
import { googleSignin, signin, signup } from "../controllers/authController.js";

const router = express.Router();

//create a user
router.post("/signup", signup);

//sign in
router.post("/signin", signin);

//google signin
router.post("/google", googleSignin);

export default router;
