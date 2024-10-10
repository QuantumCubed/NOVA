import mongoose from 'mongoose'
import User from './User';
const { Schema, model } = mongoose;

const videoSchemaDefinition = new Schema({

    title : String, 
    user : String,
    tags : [String],
    date_published : Date,
    thumbnail_src : String,
    video_src : String,
    likeCount: Number,
    dislikeCount: Number,
    viewCount: Number,
    comments: [String],
    description: String,
},

{ collection : 'videos' }

);

const Video = model('Video', videoSchemaDefinition);

export default Video;