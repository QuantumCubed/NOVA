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
    likeCount: Number,
    dislikeCount: Number,
    viewCount: Number,
    comments: [String],
},

{ collection : 'videos' }

);

const Video = model('Video', videoSchemaDefinition);

export default Video;