import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        return { refreshToken, accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Access and Refresh Token")
    }
}

const registerUser = asyncHandler(async (req, res) => {

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

    const { fullName, email, username, password } = req.body;


    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(404, "All fields are required")
    }

    // check out if user existed in DB or not

    const userExits = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (userExits) {
        throw new ApiError(409, "User with email or username already Exist")
    }


    // now we will check if avtar and coverImages exist on server or not using multer 
    // like req.body multer gives us a files method to get file path


    const avtarFilePath = req.files?.avtar[0]?.path;
    // const coverImageFilePath = req.files?.coverImage[0]?.path;
    let coverImageFilePath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageFilePath = req.files.coverImage[0].path
    }

    if (!avtarFilePath) throw new ApiError(400, "Avtar is required")



    // if (!coverImageFilePath) throw new ApiError(400, "CoverImage is required")


    const avtar = await uploadOnCloudinary(avtarFilePath);
    const coverImage = await uploadOnCloudinary(coverImageFilePath);


    if (!avtar) throw new ApiError(400, "Avtar is required");

    // now we will cerate a user in db

    const user = await User.create({
        fullName,
        avtar: avtar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });


    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) throw new ApiError(500, "Something went wrong while registering user")

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    // console.log("Email is ",email,username,password);
    if (!(email || username)) {
        throw new ApiError(400, 'username or email is required')
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) throw new ApiError(404, "User doesn't exist")

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid user credentials')
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    console.log("Access TOken and refresh token",accessToken)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    // cookies bydefault modifiable hoti h FE se unhe koi bhi modifiy kar skta h isliye httpOnly and secure true krna hota h ab cokkies sirf server se modify ho payengi
    const options = {
        httpOnly: true,
        // secure:true  set secure true for prouction but to test on local set it to false

        secure: false
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                 "User loggedin Successfully"
            )
        )

    // steps for login
    // get username and password form user
    // check that the username exist in db or not 
    // if user not found then alert it for signup
    // if user found in db then check for entered password it is correct or not 
    // if password is wrong then send alert for wrong spassword
    // if password is correct then in response send access token and refresh token for authentication

})

const logoutUser = asyncHandler(async (req, res) => {
    // console.log("req is ", req);
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true //isse hume refresh token ki new value response me milegi joki h undefined
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

export { registerUser, loginUser, logoutUser }