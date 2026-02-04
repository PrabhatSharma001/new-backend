import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser=asyncHandler(async(req,res)=>{

    // steps to register user
    // 1- get details from user (frontend)
    // 2- validate details 
    //3- check if user already register or not 
    //4-check for images and avtar 
    // 5- upload them to cloudinary 
    // 6- create user object - create entry in db 
    // 7- remove password and refresh token from response
    //8- check for user creation
    //9- return response

    const{fullName,email,username,password}=req.body;
    // console.log("FullName is+++++++++ ",fullName);

    if([fullName,email,username,password].some((field)=>field?.trim()==="")){
        throw new ApiError(404,"All fields are required")
    }

// check out if user existed in DB or not

const userExits=User.findOne({
    $or:[{username},{email}]
})

if(userExits){
    throw new ApiError(409,"User with email or username already Exist")
}


// now we will check if avtar and coverImages exist on server or not using multer 
// like req.body multer gives us a files method to get file path

const avtarFilePath=req.files?.avatar[0].path;
const coverImageFilePath=req.files?.avatar[0].path;

if(!avtarFilePath) throw new ApiError(400,"Avtar is required")
console.log("AVtar local path is",avtarFilePath);


if(!coverImageFilePath) throw new ApiError(400,"CoverImage is required")
console.log("CoverImage local path is",coverImageFilePath);




const avtar=await uploadOnCloudinary(avtarFilePath);
const coverImage=await uploadOnCloudinary(coverImageFilePath);

if(!avtar) throw new ApiError(400,"Avtar is required");

// now we will cerate a user in db

const user=User.create({
    fullName,
    avtar:avtar.url,
    coverImage:coverImage?.url||"",
    email,
    password,
    username:username.toLowerCase()
})

const createdUser=await User.findById(user._id).select("-password -refreshToken")
if(!createdUser) throw new ApiError(500,"Something went wrong while registering user")

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
})




export {registerUser}