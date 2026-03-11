import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router=Router();

//here we have injected upload middleware (upload) to upload coverimage and avtar image

router.route("/register").post(upload.fields([
    {
        name:'avtar', //this name feild should be same in frontend and backend
        maxCount:1
    },
    {
        name:'coverImage',
        maxCount:1
    }
]),registerUser)

router.route("/login").post(loginUser)

// secured routes

router.route("/logout").post(verifyJwt,logoutUser);
router.route("/refresh-token").post(refreshAccessToken)

export default router;