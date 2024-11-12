import mongoose from 'mongoose'

const { Schema, model } = mongoose;

const channelSchemaDefinition = new Schema({

    owner: String,
    channel_name: String,
    description: String,
    subscriber_count: Number,
    channel_icon_src: String,
    channel_banner_src: String,
    videos: [String],
},

{ collection : 'channels' }

);

const Channel = model('Channel', channelSchemaDefinition);

export default Channel;