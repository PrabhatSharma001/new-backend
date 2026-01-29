import mongoose ,{Schema} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true  //in mongo db kisi bhi field ko searchable bnane k liye index dete h isse easy and fast hota h find krna 
    },
     email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
     fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
     avtar:{
        type:String, //cloudinay url will be stored here
        required:true,
    },
     coverImage:{
        type:String,
    },
    watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Video",

    }],
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    refreshToken:{
        type:String
    }
},{timestamps:true});

userSchema.pre("save",async function (next) {
    if (!this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=async function () {
    const token =jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
)
return token;
}

userSchema.methods.generateRefreshToken=async function () {
    const refreshToken =jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
)
return refreshToken;
}

export const User=mongoose.model("User",userSchema);
