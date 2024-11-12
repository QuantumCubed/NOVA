import mongoose, { mongo, MongooseError } from 'mongoose';
import fs from 'fs';
import path from 'path';
import Video from './models/Video';
import User from './models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface VideoMetaData {

    title : string,
    description : string,
    tags : [string],
    user : string
    
}

interface UserMetaData {

    first_name: string,
    last_name: string,
    email: string,
    password: string,
    username: string,
    pfp_src : string

}

class DataBaseService {
    
    private readonly URI;

    constructor () {
        this.URI  = process.env.URI || process.env["URI"] || 'mongodb://localhost:27017/';
    }
    
    establishDBConnection = async () => {

        try {
            await mongoose.connect(this.URI,
                { dbName : 'TempDB' }
            );
            console.log('Database Connection Sucessful! ✅');
        }

        catch (err : any) {
            console.error('DB Connection has failed!', err.message);
        }
    }

    insertVideo = async (vidMeta : VideoMetaData) => {
        /*
        await Song.create({
            song : 'ourheartscollide',
            author : 'Unknown',
            tags : ['Muselk', 'TF2', 'Team Fortress 2'],
            date_published : new Date('January 15, 1995 03:24:00'),
            thumbnail_Source : 'Not Set',
            audio_Source : 'Not Set'
        });
        */

        await Video.create({

            title : vidMeta.title,
            description: vidMeta.description,
            tags : vidMeta.tags,
            date_published : Date.now(),
            user : vidMeta.user,
            thumbnail_src : 'temp',
            video_src : 'temp',
            likeCount: 0,
            dislikeCount: 0,
            viewCount: 0,
            comments: [],

        });

        console.log('Video added to DB!');
    }

    videoQuery = async (query : string) => {
        try {
            const videoArray = await Video.find({
                $or: [
                    { title: new RegExp(query, 'i') },
                    { user: new RegExp(query, 'i') },
                    { tags: new RegExp(query, 'i') }
                ]
            });
            // console.log(videoArray);
            return videoArray;

        } catch (error) {
            console.error('Error fetching videos:', error);
            throw error;
        }
    }

    queryByID = async (query : string) => {
        const video = await Video.findById(query);
        return video;
    }

    nVidQuery = async (n : number) => {
        const videoArray = await Video.find().limit(n)
        return videoArray;
        //console.log(songsArray);
    }

    findVideo = async () => {
        const video : any = await Video.findOne({});
        console.log(video);
        return video;
    }

    createDirectory = async (UID : string) => {

        const dirPath = path.join(__dirname, '../../../', 'data', 'users', UID, 'channels');

        try {
            await fs.promises.mkdir(dirPath, { recursive : true });
            console.log('Account Directories Created!\n', dirPath);
        } catch (err : any) {
            console.error('Error Creating User Directories!', err.message);
        }

    }

    createUser = async (userMeta : UserMetaData) => {

        const salt = await bcrypt.genSalt(10);

        const newUser = await User.create({

            first_name: userMeta.first_name,
            last_name: userMeta.last_name,
            email: userMeta.email,
            password: await bcrypt.hash(userMeta.password, salt),
            username: userMeta.username,
            subscribed_to: [],
            pfp_src: userMeta.pfp_src,
            acc_creation_date: Date.now()

        });

        this.createDirectory(newUser._id.toString());

        console.log('User added to DB!');
    }

    loginAuth = async (email : string, password : string | Buffer) => {

        const user = await User.findOne({ email : email });

        if (!user) { throw new Error('User not found!'); }

        const validated = await bcrypt.compare(password, user.password?.toString() || '');

        if (!validated) return false;

        console.log('Login Sucessful! JWT Token Generated!');

        return user;

    }


    disconnectDB = async () => {
        mongoose.connection.close();
    }
}

export default DataBaseService;