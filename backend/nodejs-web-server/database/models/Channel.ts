import mongoose from 'mongoose'

const { Schema, model } = mongoose;

const channelSchemaDefinition = new Schema({
    owner: { type: String, required: true },
    channel_name: { type: String, required: true, unique: true }, // Ensures uniqueness
    description: { type: String, default: '' },
    subscriber_count: { type: Number, default: 0 },
    subscribers: [{ type : String }],
    acc_creation_date: { type: Date, default: Date.now },
    channel_icon_src: { type: String, default: '' },
    channel_banner_src: { type: String, default: '' },
    videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }], // References Video model
},

{ collection : 'channels' }

);

const Channel = model('Channel', channelSchemaDefinition);

export default Channel;