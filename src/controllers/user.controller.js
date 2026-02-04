import { json } from "express";
import {asyncHandler} from "../utils/asyncHandler.js";


const registerUser=asyncHandler(async(req,res)=>{

    console.log("hereres")
res.status(200).json({
  message: "Ok"
});     
})

export {registerUser}