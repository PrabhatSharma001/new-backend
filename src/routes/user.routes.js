import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

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

export default router;