import mongoose, { mongo, MongooseError } from 'mongoose';
import fs from 'fs';
import path from 'path';
import Video from './models/Video';
import User from './models/User';
import Channel from './models/Channel';
import bcrypt from 'bcrypt';
import gRPC_Client from '../api/gRPC/gRPC';

interface VideoMetaData {

    title : string,
    description : string,
    tags : [string],
    user : string,
    channel : string
    
}

interface UserMetaData {

    first_name: string,
    last_name: string,
    email: string,
    password: string,
    username: string,
    pfp_src : string

}

interface ChannelMetaData {
    channel_owner: string,
    channel_name: string,
    description: string,
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

    queryUserChannelID = async (uid : string, query : string) => {

        try {
            const channel = await Channel.findOne({
                owner : uid,
                channel_name : query
            });
            return channel?._id.toString();
        } catch (error) {
            console.error('Error fetching channels:', error);
            throw error;
        }

    }

    queryVideoByID = async (uid : string) => {

        try {
            // const video = await Video.findOne({
            //     _id : uid,
            // });
            const video = await Video.findById(uid);
            return video?.video_src?.toString();
        } catch (error) {
            console.error('Error fetching video:', error);
            throw error;
        }

    }

    queryVideoByRegex = async (query : string) => {
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

    nVidQuery = async (n : number) => {
        const videoArray = await Video.find().limit(n)
        return videoArray;
        //console.log(songsArray);
    }

    createUserDirectory = async (UID : string) => {

        const dirPath = path.join(__dirname, '../../../', 'data', 'users', UID);

        try {
            await fs.promises.mkdir(dirPath, { recursive : true });
            console.log('Account Directories Created!\n', dirPath);
        } catch (err : any) {
            console.error('Error Creating User Directories!', err.message);
        }

    }

    createChannelDirectory = async (ownerID : string, channelID : string) => {

        const dirPath = path.join(__dirname, '../../../', 'data', 'channels', channelID);

        try {
            await fs.promises.mkdir(dirPath, { recursive : true });
            console.log('Channel Directories Created!\n', dirPath);
        } catch (err : any) {
            console.error('Error Creating User Directories!', err.message);
        }

    }

    createVideoDirectory = async (videoID : string, videoFile : string) => {

        const dirPathUpload = path.join(__dirname, '..', 'uploads', 'videos', videoFile);

        const dirPathRaw = path.join(
            __dirname,
            '../../../',
            'data',
            'videos',
            videoID,
            'raw'
        );

        const dirPathOut = path.join(
            __dirname,
            '../../../',
            'data',
            'videos',
            videoID,
            'out'
        );

        // console.log(path.join(dirPathRaw, videoFile));

        try {
            await fs.promises.mkdir(dirPathRaw, { recursive : true });
            await fs.promises.mkdir(dirPathOut, { recursive : true });
            await fs.promises.rename(dirPathUpload, path.join(dirPathRaw, videoFile));
            console.log('Videos Directories Created!');
            
        } catch (err : any) {
            console.error('Error Creating Video Directories!', err.message);
        }

        // console.log(path.join(dirPathRaw, videoFile), dirPathOut);

        const videoBasePath = `/data/videos/${videoID}` // `/data/users/${ownerID}/channels/${channelID}/videos/${videoID}/`;

        console.log((videoBasePath + `/raw/${videoFile}`), (videoBasePath + `/out/output.mpd`));

        await gRPC_Client((videoBasePath + `/raw/${videoFile}`), (videoBasePath + `/out/output.mpd`)); // UNIX FS : /data/UID/channels/CID/videos/VID

        return { status : 'OK', watchPath : (videoBasePath + `/out/output.mpd`) } // || 'Transcoding Server Offline!'

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

        this.createUserDirectory(newUser._id.toString());

        console.log('User added to DB!');
    }

    createChannel = async (channelMeta : ChannelMetaData) => {

        const newChannel = await Channel.create({

            owner: channelMeta.channel_owner,
            channel_name: channelMeta.channel_name,
            description: channelMeta.description,
            subscriber_count: 0,
            channel_icon_src: '',
            channel_banner_src: '',
            videos: []

        });

        this.createChannelDirectory(channelMeta.channel_owner, newChannel._id.toString());

        console.log('Channel added to DB!');

    }

    uploadVideo = async (vidMeta : VideoMetaData, filename : string) => {

        const newVideo = await Video.create({

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

        const channelID = await this.queryUserChannelID(vidMeta.user, vidMeta.channel);

        if (!channelID) { console.error('ChannelID is Undefined'); return; }

        // console.log(channelID);

        const result = await this.createVideoDirectory(newVideo._id.toString(), filename);

        // { status : status, watchPath : (videoBasePath + `out/output.mpd`) }

        Object.assign(newVideo, { channel : channelID, video_src : result.watchPath });
        await newVideo.save();

        console.log('Video added to DB!');
    }

    loginAuth = async (email : string, password : string | Buffer) => {

        const user = await User.findOne({ email : email });

        if (!user) { throw new Error('User not found!'); }

        const validated = await bcrypt.compare(password, user.password?.toString() || '');

        if (!validated) return false;

        console.log('Login Sucessful! JWT Token Generated!');

        return user;

    }

    // updateUserByID = async (uid : string, newUserData : UserMetaData) => {

    //     await User.findByIdAndUpdate(
    //         uid,
    //         {  
    //             first_name: newUserData.first_name,
    //             last_name: newUserData.last_name,
    //             email: newUserData.email,
    //             password: newUserData.password,
    //             username: newUserData.username,
    //             pfp_src : newUserData.pfp_src
    //         },
    //         { new : true, runValidators : true }
    //     );

    // }

    updateUserPFP = async (uid : string, filename : string) => {

        const pfpUploadPath = path.join(__dirname, '..', 'uploads', 'images', filename);

        const rawProfilePath = path.join(
            __dirname,
            '../../../',
            'data',
            'users',
            uid,
        );
        
        try {
            await fs.promises.rename(pfpUploadPath, path.join(rawProfilePath, filename));
            await User.findByIdAndUpdate(
                uid,
                { pfp_src : `/data/users/${uid}/${filename}`},
                { new : true, runValidators : true }
            );
        } catch (err : any) {
            console.error('Error Uploading PFP!', err.message);
        }

        console.log('PFP Uploaded!');

    }

    disconnectDB = async () => {
        mongoose.connection.close();
    }
}

export default DataBaseService;