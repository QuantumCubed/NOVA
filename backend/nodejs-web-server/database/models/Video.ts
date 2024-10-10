import mongoose from 'mongoose'

const { Schema, model } = mongoose;

const videoSchemaDefinition = new Schema({

    title : String, 
    author : String,
    tags : [String],
    date_published : Date,
    thumbnail_src : String,
    video_src : String

},

{ collection : 'videos' }

);

const Video = model('Video', videoSchemaDefinition);

export default Video;