import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateUser, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

//here we have injected upload middleware (upload) to upload coverimage and avatar image

router.route("/register").post(upload.fields([
    {
        name: 'avatar', //this name feild should be same in frontend and backend
        maxCount: 1
    },
    {
        name: 'coverImage',
        maxCount: 1
    }
]), registerUser)

router.route("/login").post(loginUser)

// secured routes

router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(verifyJwt,refreshAccessToken)
router.route("/change-password").patch(verifyJwt,changeCurrentPassword);
router.route("/get-user").get(verifyJwt,getCurrentUser);
router.route("/update-user").patch(verifyJwt,updateUser);
router.route("/update-avatar").patch(verifyJwt,upload.single("avatar"),updateUserAvatar);
router.route("/update-coverImage").patch(verifyJwt,upload.single("coverImage"),updateUserCoverImage)
router.route("/get-user-profile/:username").get(verifyJwt,getUserChannelProfile)
router.route("/watch-history").get(verifyJwt,getWatchHistory)

export default router;