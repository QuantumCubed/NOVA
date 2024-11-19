import mongoose from 'mongoose'
const { Schema, model } = mongoose;

const videoSchemaDefinition = new Schema({
    title : String,
    description: String,
    tags : [String],
    date_published : Date,
    user : String,
    channel : String, // CID
    thumbnail_src : String,
    video_src : String,
    likeCount: { type: Number, default: 0 },
    likedUsers: [{ type : String }],
    dislikeCount: { type: Number, default: 0 },
    dislikedUsers: [{ type : String }],
    viewCount: { type: Number, default: 0 },
    comments: [String],
},

{ collection : 'videos' }

);

const Video = model('Video', videoSchemaDefinition);

export default Video;