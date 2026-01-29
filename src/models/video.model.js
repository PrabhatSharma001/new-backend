import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema({
    videFile: {
        type: String, //cloudinary url
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number, //ye duration cloudinary hi dega hume
        required: true
    },
    views: {
        type: Number, //cloudinary url
        default: 0
    },
    isPublished: {
        type: Boolean
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
    // likes: {
    //     type: Number,
    //     default: 0
    // },
    // comments:{
    //     type:Number,
    //     default:0
    // },

}, { timestamps: true })


    videoSchema.plugin(mongooseAggregatePaginate)
    export const Video=mongoose.model("Video",videoSchema);
