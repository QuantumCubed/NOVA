import mongoose from 'mongoose'
import Video from './Video';

const { Schema, model } = mongoose;

const channelSchemaDefinition = new Schema({

    owner: String,
    subscriber_count: Number,
    channel_icon_src: String,
    channel_banner_src: String,
    description: String,
    videos: [Video],
},

{ collection : 'channels' }

);

const Channel = model('Channel', channelSchemaDefinition);

export default Channel;