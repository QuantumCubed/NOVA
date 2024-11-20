import mongoose from 'mongoose'

const { Schema, model } = mongoose;

const userSchemaDefinition = new Schema({

    // PRIVATE FIELDS
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    channels_owned: [String],

    // PUBLIC FIELDS
    username: String,
    subscribed_to: [String],
    pfp_src: { type: String, default: '/nodejs-web-server/public/anonymous.jpg' },
    acc_creation_date: Date
},

{ collection : 'users' }

);

const User = model('User', userSchemaDefinition);

export default User;