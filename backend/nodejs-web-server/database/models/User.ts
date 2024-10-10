import mongoose from 'mongoose'

const { Schema, model } = mongoose;

const userSchemaDefinition = new Schema({

    // PRIVATE FIELDS
    first_name: String,
    last_name: String,
    email: String,
    password: String,

    // PUBLIC FIELDS
    username: String,
    subscribed_to: [String]
},

{ collection : 'users' }

);

const User = model('User', userSchemaDefinition);

export default User;