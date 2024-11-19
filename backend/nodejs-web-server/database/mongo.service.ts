import mongoose, { mongo, MongooseError } from 'mongoose';
import fs from 'fs';
import path from 'path';
import Video from './models/Video';
import User from './models/User';
import Channel from './models/Channel';
import bcrypt from 'bcrypt';
import gRPC_Client from '../api/gRPC/gRPC';

interface VideoMetaData {

    title: string,
    description: string,
    tags: [string],
    user: string,
    channel_name: string,
    channel_id: string

}

interface UserMetaData {

    first_name: string,
    last_name: string,
    email: string,
    password: string,
    username: string,
    pfp_src: string

}

interface ChannelMetaData {
    channel_owner: string,
    channel_name: string,
    description: string,
}

class DataBaseService {

    private readonly URI: string;

    constructor() {
        this.URI = process.env.URI || 'undefined'; // || "mongodb://localhost:27017/";
    }

    /**
     * Establishes Database Connection
     */

    establishDBConnection = async () => {

        try {
            await mongoose.connect(this.URI,
                { dbName: process.env.DB }
            );
            console.log('Database Connection Sucessful! ✅');
        }

        catch (err: any) {
            console.error('DB Connection has failed!', err.message);
        }
    }

    /**
     * Queries user data based on ID
     * @param uid UserID
     * @returns User || null
     */

    queryUserData = async (uid: string) => {

        try {

            return await User.findById(uid, 'first_name last_name email channels_owned username acc_creation_date');

        } catch (error) {
            console.error('Unable to retrieve user data:', error);
            return null;
        }

    }

    queryUserPFP = async (uid: string) => {

        try {

            const user = await User.findById(uid, 'pfp_src');

            return user?.pfp_src || '';

        } catch (error) {
            console.error('Unable to retrieve user pfp:', error);
            return null;
        }

    }

    /**
     * Queries a user's channel based on the user's ID and channel's name
     * @param uid UserID
     * @param query Channel Name
     * @returns channelID || null
     */

    queryUserChannelID = async (uid: string, query: string) => {

        try {
            const channel = await Channel.findOne({
                owner: uid,
                channel_name: query
            });
            return channel?._id.toString();
        } catch (error) {
            console.error('Error fetching channels:', error);
            return null;
        }

    }

    /**
     * Returns a channel from ChannelID
     * @param cid ChannelID
     * @returns Channel || null
     */

    queryChannelByID = async (cid : string) => {

        try {
            return await Channel.findById(cid);
        } catch (error) {
            console.error('Error fetching channels:', error);
            return null;
        }

    }

    /**
     * Queries a video based on videoID
     * @param vid userID
     * @returns videoID || null
     */

    queryVideoByID = async (vid: string) => {

        try {

            // const video = await Video.findById(vid);
            // return video?.video_src?.toString();

            return await Video.findById(vid, 'video_src');

        } catch (error) {
            console.error('Error fetching video:', error);
            return null;
        }

    }

    /**
     * Queries an array of videos that have some relation to the string
     * @param query String to query video
     * @returns videoArray || null
     */

    queryVideoByRegex = async (query: string) => {
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
            return null;
        }
    }

    /**
     * Queries n videos
     * @param n Number of videos
     * @returns videoArray || null
     */

    nVidQuery = async (n: number) => {

        try {

            // const videoArray = await Video.find().limit(n);
            // return videoArray;

            return await Video.find().limit(n);

        } catch (error) {
            console.error('Error fetching videos:', error);
            return null;
        }

    }

    /**
     * Fetches channels owned by the user
     * @param uid User ID
     * @returns Channel Array || null
     */

    queryUserChannels = async (uid: string) => {

        try {

            const user = await User.findById(uid, 'channels_owned');

            const usrChannelArray: typeof Channel[] | null[] | any[] = await Promise.all(
                user?.channels_owned.map(channelID => Channel.findById(channelID)) || []
            );

            // console.log(usrChannelArray[0]._id);

            return usrChannelArray;

        } catch (error) {
            console.error("Error fetching channels by IDs:", error);
            return null;
        }

    }

    /**
     * Generates a directory for the user in the filesystem
     * @param UID UserID
     */

    createUserDirectory = async (UID: string) => {

        // const dirPath = path.join(__dirname, '../../../', 'data', 'users', UID);

        const dirPath = path.join('/', 'data', 'users', UID);

        try {
            await fs.promises.mkdir(dirPath, { recursive: true });
            console.log('Account Directories Created!\n', dirPath);
        } catch (err: any) {
            console.error('Error Creating User Directories!', err.message);
        }

    }

    /**
     * Generates a directory for the channel in the filesystem
     * @param channelID The channelID of the channel
     */

    createChannelDirectory = async (channelID: string) => {

        // const dirPath = path.join(__dirname, '../../../', 'data', 'channels', channelID);

        const dirPath = path.join('/', 'data', 'channels', channelID);

        try {
            await fs.promises.mkdir(dirPath, { recursive: true });
            console.log('Channel Directories Created!\n', dirPath);
        } catch (err: any) {
            console.error('Error Creating User Directories!', err.message);
        }

    }

    /**
     * Generates a directory for the video in the filesystem and calls the gRPC server to transcode the video
     * @param videoID VideoID
     * @param videoFile VideoFile Name
     * @returns gRPC status and the target src path for the transcoded output || null
     */

    createVideoDirectory = async (videoID: string, videoFile: string) => {

        const dirPathUpload = path.join(__dirname, '..', 'uploads', 'videos', videoFile);

        // const dirPathRaw = path.join(
        //     __dirname,
        //     '../../../',
        //     'data',
        //     'videos',
        //     videoID,
        //     'raw'
        // );

        const dirPathRaw = path.join('/', 'data', 'videos', videoID, 'raw');

        // const dirPathOut = path.join(
        //     __dirname,
        //     '../../../',
        //     'data',
        //     'videos',
        //     videoID,
        //     'out'
        // );

        const dirPathOut = path.join('/', 'data', 'videos', videoID, 'out');

        // console.log(path.join(dirPathRaw, videoFile));

        try {

            await fs.promises.mkdir(dirPathRaw, { recursive: true });
            await fs.promises.mkdir(dirPathOut, { recursive: true });
            // await fs.promises.rename(dirPathUpload, path.join(dirPathRaw, videoFile));
            await fs.promises.copyFile(dirPathUpload, path.join(dirPathRaw, videoFile));
            await fs.promises.unlink(dirPathUpload);
            console.log('Videos Directories Created!');

        } catch (err: any) {
            console.error('Error Creating Video Directories!', err.message);
            return null;
        }

        // console.log(path.join(dirPathRaw, videoFile), dirPathOut);

        const videoBasePath = `/data/videos/${videoID}` // `/data/users/${ownerID}/channels/${channelID}/videos/${videoID}/`;

        console.log((videoBasePath + `/raw/${videoFile}`), (videoBasePath + `/out/output.mpd`));

        try {

            await gRPC_Client((videoBasePath + `/raw/${videoFile}`), (videoBasePath + `/out/output.mpd`)); // UNIX FS : /data/UID/channels/CID/videos/VID

            return { status: 'OK', watchPath: (videoBasePath + `/out/output.mpd`) } // || 'Transcoding Server Offline!'

        } catch (error) {
            console.error('gRPC Error:', error);
            return null;

        }

    }

    /**
     * Generates a BSON document for the user in MongoDB
     * @param userMeta User data to input in DB
     */

    createUser = async (userMeta: UserMetaData) => {

        try {

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
        } catch (error) {
            console.error('Error creating user document:', error);
        }
    }

    /**
     * Generates a BSON document for the channel in MongoDB
     * @param channelMeta Channel data to input in DB
     */

    createChannel = async (channelMeta: ChannelMetaData) => {

        try {

            const newChannel = await Channel.create({

                owner: channelMeta.channel_owner,
                channel_name: channelMeta.channel_name,
                description: channelMeta.description,
                subscriber_count: 0,
                acc_creation_date: Date.now(),
                channel_icon_src: '',
                channel_banner_src: '',
                videos: []

            });

            await this.createChannelDirectory(channelMeta.channel_owner);

            await User.findByIdAndUpdate(
                channelMeta.channel_owner,
                { $push: { channels_owned: newChannel._id.toString() } },
                { new: true, runValidators: true }
            );

            console.log('Channel added to DB!');

        } catch (error) {
            console.log('Error creating channel:', error);
        }

    }

    /**
     * Generates a BSON document for the video in MongoDB
     * @param vidMeta Video data to input in DB
     * @param vidFileName The name of the video file
     * @param thumbnailFileName The thumbnail file name for the video
     */

    uploadVideo = async (vidMeta: VideoMetaData, vidFileName: string, thumbnailFileName?: string) => {

        try {

            const newVideo = await Video.create({

                title: vidMeta.title,
                description: vidMeta.description,
                tags: vidMeta.tags,
                date_published: Date.now(),
                user: vidMeta.user,
                channel: vidMeta.channel_id,
                thumbnail_src: 'temp',
                video_src: 'temp',
                likeCount: 0,
                dislikeCount: 0,
                viewCount: 0,
                comments: [],

            });

            if (thumbnailFileName) {
                this.updateVideoThumbnail(vidMeta.user, newVideo._id.toString(), thumbnailFileName);
            }

            const result = await this.createVideoDirectory(newVideo._id.toString(), vidFileName);

            if (!result) { throw new Error('Video directory error!'); }

            // { status : status, watchPath : (videoBasePath + `out/output.mpd`) }

            Object.assign(newVideo, { video_src: result.watchPath });
            await newVideo.save();

            console.log('Video added to DB!');

        } catch (error) {
            console.error('Error uploading video:', error);
        }
    }

    /**
     * Validates a user's login information 
     * @param email The user's email
     * @param password The user's password
     * @returns User's UID && Username || null
     */

    loginAuth = async (email: string, password: string | Buffer) => {

        try {

            const user = await User.findOne({ email: email });

            if (!user) { throw new Error('User not found!'); }

            const validated = await bcrypt.compare(password, user.password?.toString() || '');

            if (!validated) return null;

            // console.log('Login Sucessful! JWT Token Generated!');

            return { id: user._id.toString(), username: user.username };

        } catch (error) {
            console.error('Failed to authenticate user:', error);
            return null;
        }

    }

    /**
     * Updates the user's profile picture
     * @param uid UserID
     * @param filename Uploaded profile picture filename
     */


    updateUserPFP = async (uid: string, filename: string) => {

        const pfpUploadPath = path.join(__dirname, '..', 'uploads', 'images', filename);

        const rawProfilePath = path.join(
            __dirname,
            '../../../',
            'data',
            'users',
            uid,
        );

        try {

            // await fs.promises.rename(pfpUploadPath, path.join(rawProfilePath, filename));
            await fs.promises.copyFile(pfpUploadPath, path.join(rawProfilePath, filename));
            await fs.promises.unlink(pfpUploadPath);
            await User.findByIdAndUpdate(
                uid,
                { pfp_src: `/data/users/${uid}/${filename}` },
                { new: true, runValidators: true }
            );

        } catch (err: any) {
            console.error('Error Uploading PFP!', err.message);
        }

        console.log('PFP Uploaded!');

    }

    /**
     * Updates the thumbnail of a video
     * @param uid userID
     * @param vid videoID
     * @param filename Uploaded thumbnail filename
     * @returns 
     */

    updateVideoThumbnail = async (uid: string, vid: string, filename: string) => {

        try {

            const user = await User.findById(uid, 'channels_owned');
            const userChannels: string[] | null = user ? user.channels_owned : null;

            const video = await Video.findById(vid, 'channel');
            const videoChannel: string | null | undefined = video ? video.channel : null;

            // console.log(user);
            // console.log(userChannels);
            // console.log(video);
            // console.log(videoChannel);

            if (!userChannels || !videoChannel || !(userChannels.includes(videoChannel))) {
                throw new Error('User does not control that channel!');
            }

        } catch (error) {
            console.error('Error validating channel permissions:', error);
        }

        const thumbnailUploadPath = path.join(__dirname, '..', 'uploads', 'thumbnails', filename);

        const rawVideoPath = path.join(
            __dirname,
            '../../../',
            'data',
            'videos',
            vid,
        );

        try {
            await fs.promises.rename(thumbnailUploadPath, path.join(rawVideoPath, filename));
            await Video.findByIdAndUpdate(
                vid,
                { thumbnail_src: `/data/videos/${vid}/${filename}` },
                { new: true, runValidators: true }
            );
        } catch (err: any) {
            console.error('Error Uploading Thumbnail!', err.message);
            return;
        }

        console.log('Thumbnail Uploaded!');

    }

    /**
     * Updates the description of a channel
     * @param channelId The ID of the channel to update
     * @param newDescription The new description
     * @returns Updated Channel object or null
     */
    updateChannelDescription = async (channelId: string, newDescription: string) => {
        try {
            const updatedChannel = await Channel.findByIdAndUpdate(
                channelId,
                { description: newDescription },
                { new: true, runValidators: true }
            );
            return updatedChannel;
        } catch (error) {
            console.error('Error updating channel description:', error);
            return null;
        }
    };

    /**
* Fetches a channel by its name, including its videos
* @param name Channel name
* @returns Channel object with populated videos or null
*/
    fetchChannelByName = async (name: string) => {
        try {
            const channel = await Channel.findOne({ channel_name: name }).populate('videos');
            return channel;
        } catch (error) {
            console.error('Error fetching channel by name:', error);
            return null;
        }
    };

    // WIP

    deleteVideo = async (uid: string, cid: string, vid: string) => {



    }

    // WIP

    deleteChannel = async (uid: string, cid: string) => {



    }

    // WIP

    deleteUser = async (uid: string, password: string | Buffer) => {

        const user = await User.findById(uid);

        if (user) {

            const validated = await bcrypt.compare(password, user.password?.toString() || '');
            if (validated) {
                try {
                    await fs.promises.rm(path.join(
                        __dirname,
                        '../../../',
                        'data',
                        'users',
                        uid
                    ));
                    await Video.deleteMany({ user: uid });
                    await Channel.deleteMany({ owner: uid });
                    await User.findByIdAndDelete(uid);
                } catch (err: any) {
                    console.error('Unable to delete user', err.message);
                }
            }
        }
        console.log('All User Data Deleted!');
    }

    // WIP

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

    /**
     * Disconnects connection to the Database
     */

    disconnectDB = async () => {
        mongoose.connection.close();
    }
}

export default DataBaseService;