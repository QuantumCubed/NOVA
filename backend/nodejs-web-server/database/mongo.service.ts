import mongoose, { mongo, MongooseError } from 'mongoose';
import fs from 'fs';
import path from 'path';
import Video from './models/Video';
import User from './models/User';
import Channel from './models/Channel';
import bcrypt from 'bcrypt';
import gRPC_Client from '../api/gRPC/gRPC';
import { Bucket, Storage } from '@google-cloud/storage';

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

}

interface ChannelMetaData {
    channel_owner: string,
    channel_name: string,
    description: string,
}

class DataBaseService {

    private readonly URI: string;
    private readonly storage: Storage
    private readonly bucketName: string
    private readonly bucket : Bucket

    constructor() {
        this.URI = process.env.URI || 'undefined'; // || "mongodb://localhost:27017/";
        // this.storage = new Storage(); - USE WHEN DEPLOYED TO GOOGLE CLOUD RUN!!!
        this.storage = new Storage({
            // projectId: process.env.GCR_PID,
            keyFilename: `./elegant-atom-442000-q0-d8e95dd970eb.json` // process.env.GCR_KEYFILE_PATH
        });
        this.bucketName = 'nova_data';
        this.bucket = this.storage.bucket(this.bucketName);
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

            if(!user?.pfp_src) { throw new Error('PFP Query Error!'); }

            const pfpFile = this.bucket.file(user.pfp_src);

            const [url] = await pfpFile.getSignedUrl({
                action: 'read', // Grant permission to read the file
                expires: Date.now() + 3600 * 1000, // URL expires in 1 hour
            });

            return url

        } catch (error) {
            console.error('Unable to retrieve user pfp:', error);
            return null;
        }

    }

    queryVideoThumbnail = async (vid: string) => {

        try {

            const video = await Video.findById(vid, 'thumbnail_src');

            if(!video?.thumbnail_src) { throw new Error('Video Thumbnail Query Error!'); }

            const thumbnailFile = this.bucket.file(video.thumbnail_src);

            const [url] = await thumbnailFile.getSignedUrl({
                action: 'read', // Grant permission to read the file
                expires: Date.now() + 3600 * 1000, // URL expires in 1 hour
            });

            return url

        } catch (error) {
            console.error('Unable to retrieve video thumbnail:', error);
            return null;
        }

    }

    /**
     * Returns the path of the channel icon
     * @param cid ChannelID
     * @returns Channel Icon Path || null
     */

    queryChannelIcon = async (cid: string) => {

        try {
            
            const channelIcon = await Channel.findById(cid, 'channel_icon_src');

            if(!channelIcon?.channel_icon_src) { throw new Error('Channel Icon Query Error!'); }

            const channelIconFile = this.bucket.file(channelIcon.channel_icon_src);

            const [url] = await channelIconFile.getSignedUrl({
                action: 'read', // Grant permission to read the file
                expires: Date.now() + 3600 * 1000, // URL expires in 1 hour
            });

            return url

        } catch (error) {
            console.error('Unable to retrieve channel icon:', error);
            return null;
        }

    }

    /**
     * Returns the path of the channel banner
     * @param cid ChannelID
     * @returns Channel Icon banner || null
     */

    queryChannelBanner = async (cid: string) => {

        try {

            const channelBanner = await Channel.findById(cid, 'channel_banner_src');

            if(!channelBanner?.channel_banner_src) { throw new Error('Channel Banner Query Error!'); }

            const channelBannerFile = this.bucket.file(channelBanner.channel_banner_src);

            const [url] = await channelBannerFile.getSignedUrl({
                action: 'read', // Grant permission to read the file
                expires: Date.now() + 3600 * 1000, // URL expires in 1 hour
            });

            return url

        } catch (error) {
            console.error('Unable to retrieve channel banner:', error);
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

    queryChannelByID = async (cid: string) => {

        try {
            return await Channel.findById(cid);
        } catch (error) {
            console.error('Error fetching channels:', error);
            return null;
        }

    }

    /**
     * Returns all channels in the collection
     * @returns Channel Array
     */

    queryAllChannels = async () => {
        try {
            return await Channel.find();
        } catch (error) {
            console.error('Unable to retrieve all channels:', error);
            return null;
        }
    }

    queryAllVideos = async () => {
        try {
            return await Video.find();
        } catch (error) {
            console.error('Unable to retrieve all videos:', error);
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

            return await Video.findById(vid);

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

        // const dirPath = path.join('/', 'data', 'users', UID);

        const dirPath = `data/users/${UID}`;

        try {
            // await fs.promises.mkdir(dirPath, { recursive: true });
            //await placeholderFile.delete();
            const usrDir = this.bucket.file(`${dirPath}/placeholder`);
            await usrDir.save('', { contentType: 'application/x-directory' });
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

        // const dirPath = path.join('/', 'data', 'channels', channelID);

        const dirPath = `data/channels/${channelID}`;

        try {
            //await fs.promises.mkdir(dirPath, { recursive: true });
            const channelDir = this.bucket.file(`${dirPath}/placeholder`);
            await channelDir.save('', { contentType: 'application/x-directory' });
            console.log('Channel Directories Created!\n', dirPath);
        } catch (err: any) {
            console.error('Error Creating Channel Directories!', err.message);
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
        const dirPathRaw = `data/videos/${videoID}/raw`;
        const dirPathOut = `data/videos/${videoID}/out`;

        try {

            const channelDirRaw = this.bucket.file(`${dirPathRaw}/placeholder`);
            await channelDirRaw.save('', { contentType: 'application/x-directory' });

            const channelDirOut = this.bucket.file(`${dirPathOut}/placeholder`);
            await channelDirOut.save('', { contentType: 'application/x-directory' });

            const originalVideo = this.bucket.file(`data/videos/${videoID}/raw/${videoFile}`);

            await originalVideo.save(await fs.promises.readFile(dirPathUpload), {
                gzip: true,
                metadata: {
                    contentType: 'application/octet-stream',
                },
            });
        
            await fs.promises.unlink(dirPathUpload);

            console.log('Videos Directories Created!');

        } catch (err: any) {
            console.error('Error Creating Video Directories!', err.message);
            return null;
        }

        const videoBasePath = `data/videos/${videoID}`

        try {

            // await gRPC_Client((videoBasePath + `/raw/${videoFile}`), (videoBasePath + `/out/output.mpd`)); // UNIX FS : /data/UID/channels/CID/videos/VID

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

            await this.createChannelDirectory(newChannel._id.toString());

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
                this.updateVideoThumbnail(vidMeta.user, newVideo._id.toString(), thumbnailFileName, path.join(__dirname, '..', 'uploads', 'videos', thumbnailFileName));
            }

            const result = await this.createVideoDirectory(newVideo._id.toString(), vidFileName);

            if (!result) { throw new Error('Video directory error!'); }

            // { status : status, watchPath : (videoBasePath + `out/output.mpd`) }

            await Channel.findByIdAndUpdate(
                vidMeta.channel_id,
                {
                    $push: { videos: newVideo._id.toString() },
                }
            );

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

        // const rawProfilePath = path.join(
        //     __dirname,
        //     '../../../',
        //     'data',
        //     'users',
        //     uid,
        // );

        try {

            // await fs.promises.rename(pfpUploadPath, path.join(rawProfilePath, filename));
            // await fs.promises.copyFile(pfpUploadPath, path.join(rawProfilePath, filename));
            // await fs.promises.unlink(pfpUploadPath);

            const profilePicture = this.bucket.file(`data/users/${uid}/${filename}`);

            await profilePicture.save(await fs.promises.readFile(pfpUploadPath), {
                gzip: true,
                metadata: {
                    contentType: 'image/jpeg',
                },
            });

            await fs.promises.unlink(pfpUploadPath);

            // const fileUrl = `https://storage.googleapis.com/${this.bucketName}/users/${uid}/${filename}`;

            const fileUrl = `data/users/${uid}/${filename}`;

            await User.findByIdAndUpdate(
                uid,
                { pfp_src: fileUrl },
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

    updateVideoThumbnail = async (uid: string, vid: string, filename: string, thumbUploadPath? : string) => {

        try {

            const isOwner = await Video.findById(vid).where('user').equals(uid);

            if (!isOwner) {
                throw new Error('User does not control that channel!');
            }

        } catch (error) {
            console.error('Error validating channel permissions:', error);
        }

        const thumbnailUploadPath = thumbUploadPath || path.join(__dirname, '..', 'uploads', 'thumbnails', filename);

        try {

            const videoThumbnail = this.bucket.file(`data/videos/${vid}/${filename}`);

            await videoThumbnail.save(await fs.promises.readFile(thumbnailUploadPath), {
                gzip: true,
                metadata: {
                    contentType: 'image/jpeg',
                },
            });

            await fs.promises.unlink(thumbnailUploadPath);
            
            await Video.findByIdAndUpdate(
                vid,
                { thumbnail_src: `data/videos/${vid}/${filename}` },
                { new: true, runValidators: true }
            );
        } catch (err: any) {
            console.error('Error Uploading Thumbnail:', err.message);
            return;
        }

        console.log('Thumbnail Uploaded!');

    }

    updateChannelVisuals = async (uid: string, cid: string, icon_file?: string, banner_file?: string) => {

        if (!icon_file && !banner_file) { return; }

        try {

            const isOwner = await Channel.findById(cid).where('owner').equals(uid);

            if (!isOwner) {
                throw new Error('User does not control that channel!');
            }

        } catch (error) {
            console.error('Error validating channel permissions:', error);
        }

        const visualsUploadPath = path.join(__dirname, '..', 'uploads', 'channel_rec');

        // const rawChannelPath = path.join(
        //     __dirname,
        //     '../../../',
        //     'data',
        //     'channels',
        //     cid
        // );

        try {
            
            if (icon_file) {
                // await fs.promises.copyFile(path.join(visualsUploadPath, icon_file), path.join(rawChannelPath, icon_file));

                const channelIcon = this.bucket.file(`data/channels/${cid}/${icon_file}`);

                await channelIcon.save(await fs.promises.readFile(path.join(visualsUploadPath, icon_file)), {
                    gzip: true,
                    metadata: {
                        contentType: 'image/jpeg',
                    },
                });

                await fs.promises.unlink(path.join(visualsUploadPath, icon_file));

                await Channel.findByIdAndUpdate(
                    cid,
                    {
                        channel_icon_src: `data/channels/${cid}/${icon_file}`,
                    },
                    { new: true, runValidators: true }
                );
            }

            if (banner_file) {
                // await fs.promises.copyFile(path.join(visualsUploadPath, banner_file), path.join(rawChannelPath, banner_file));

                const channelBanner = this.bucket.file(`data/channels/${cid}/${banner_file}`);

                await channelBanner.save(await fs.promises.readFile(path.join(visualsUploadPath, banner_file)), {
                    gzip: true,
                    metadata: {
                        contentType: 'image/jpeg',
                    },
                });

                await fs.promises.unlink(path.join(visualsUploadPath, banner_file));

                await Channel.findByIdAndUpdate(
                    cid,
                    {
                        channel_banner_src: `data/channels/${cid}/${banner_file}`
                    },
                    { new: true, runValidators: true }
                );
            }

            // await Channel.findByIdAndUpdate(
            //     cid,
            //     {
            //         channel_icon_src: `/data/channels/${cid}/${icon_file}`,
            //         channel_banner_src: `/data/channels/${cid}/${banner_file}`
            //     },
            //     { new: true, runValidators: true }
            // );
        } catch (err: any) {
            console.error('Error Uploading Visuals:', err.message);
        }

        console.log('Visuals Uploaded!');

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

    /**
     * Determines if the user is subscribed to the given channel
     * @param uid UserID
     * @param cid ChannelID
     * @returns true or false
     */

    isSubscribed = async (uid: string, cid: string) => {

        try {
            if (await Channel.findById(cid).where('subscribers').in([uid])) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('An Error has occured:', error);
        }

    }

    /**
     * Subscribes a user to a channel
     * @param uid UserID
     * @param cid ChannelID
     * @returns Subscription status
     */

    userSubHandler = async (uid: string, cid: string) => {

        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            const isSub = await this.isSubscribed(uid, cid)

            if (isSub) {
                const unsub = await this.userUnsubHandler(uid, cid);
                await session.commitTransaction();
                return { message: 'Sucessfully Unsubscribed!', subscriber_count: unsub?.subscriber_count }; // unsubbed
            }

            const updatedChannel = await Channel.findByIdAndUpdate(
                cid,
                {
                    $push: { subscribers: uid },
                    $inc: { subscriber_count: 1 }
                },
                { new: true, runValidators: true }
            );


            await User.findByIdAndUpdate(
                uid,
                { $push: { subscribed_to: cid } },
                { runValidators: true }
            );

            await session.commitTransaction();

            return { message: 'Sucessfully Subscribed!', subscriber_count: updatedChannel?.subscriber_count }; // subbed // return updatedChannel?.subscriber_count;

        } catch (error) {
            await session.commitTransaction();
            console.error('An Error has occured:', error);
        }

    }

    /**
     * Unsubscribes a user from a channel
     * @param uid UserID
     * @param cid ChannelID
     * @returns ChannelDocument
     */

    userUnsubHandler = async (uid: string, cid: string) => {

        try {

            const updatedChannel = await Channel.findByIdAndUpdate(
                cid,
                {
                    $pull: { subscribers: uid },
                    $inc: { subscriber_count: -1 }
                },
                { new: true, runValidators: true }
            );

            await User.findByIdAndUpdate(
                uid,
                { $pull: { subscribed_to: cid } },
                { new: true, runValidators: true }
            );

            return updatedChannel;

        } catch (error) {
            console.error('An Error has occured:', error);
        }

    }

    /**
     * Determines if the user has liked the given video
     * @param uid UserID
     * @param vid ChannelID
     * @returns true or false
     */

    hasLiked = async (uid: string, vid: string) => {

        try {
            if (await Video.findById(vid).where('likedUsers').in([uid])) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('An Error has occured:', error);
        }

    }

    /**
     * Removes a like from a video
     * @param uid UserID
     * @param vid VideoID
     * @returns VideoDocument
     */

    videoLikeHandler = async (uid: string, vid: string) => {

        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            const hasliked = await this.hasLiked(uid, vid)

            if (hasliked) {
                const unlike = await this.videoUnlikeHandler(uid, vid);
                await session.commitTransaction();
                return { message: 'Sucessfully Unliked!', like_count: unlike?.likeCount }; // unsubbed
            }

            const updatedVideo = await Video.findByIdAndUpdate(
                vid,
                {
                    $push: { likedUsers: uid },
                    $inc: { likeCount: 1 }
                },
                { new: true, runValidators: true }
            );

            await session.commitTransaction();

            return { message: 'Sucessfully Liked!', like_count: updatedVideo?.likeCount }; // subbed // return updatedChannel?.subscriber_count;

        } catch (error) {
            await session.commitTransaction();
            console.error('An Error has occured:', error);
        }

    }

    /**
     * Removes a like from a video
     * @param uid UserID
     * @param vid VideoID
     * @returns VideoDocument
     */

    videoUnlikeHandler = async (uid: string, vid: string) => {

        try {

            const updatedVideo = await Video.findByIdAndUpdate(
                vid,
                {
                    $pull: { likedUsers: uid },
                    $inc: { likeCount: -1 }
                },
                { new: true, runValidators: true }
            );

            return updatedVideo;

        } catch (error) {
            console.error('An Error has occured:', error);
        }

    }

    /**
     * Determines if the user has disliked the given video
     * @param uid UserID
     * @param vid ChannelID
     * @returns true or false
     */

    hasDisliked = async (uid: string, vid: string) => {

        try {
            if (await Video.findById(vid).where('dislikedUsers').in([uid])) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('An Error has occured:', error);
        }

    }

    /**
     * Adds a dislike to a video
     * @param uid UserID
     * @param vid VideoID
     * @returns VideoDocument
     */

    videoDislikeHandler = async (uid: string, vid: string) => {

        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            const hasDisliked = await this.hasDisliked(uid, vid)

            if (hasDisliked) {
                const undisliked = await this.videoUndislikeHandler(uid, vid);
                await session.commitTransaction();
                return { message: 'Sucessfully Undisliked!', dislike_count: undisliked?.dislikeCount }; // unsubbed
            }

            const updatedVideo = await Video.findByIdAndUpdate(
                vid,
                {
                    $push: { dislikedUsers: uid },
                    $inc: { dislikeCount: 1 }
                },
                { new: true, runValidators: true }
            );

            await session.commitTransaction();

            return { message: 'Sucessfully Disliked!', dislike_count: updatedVideo?.dislikeCount }; // subbed // return updatedChannel?.subscriber_count;

        } catch (error) {
            await session.commitTransaction();
            console.error('An Error has occured:', error);
        }

    }

    /**
     * Removes a dislike from a video
     * @param uid UserID
     * @param vid VideoID
     * @returns VideoDocument
     */

    videoUndislikeHandler = async (uid: string, vid: string) => {

        try {

            const updatedVideo = await Video.findByIdAndUpdate(
                vid,
                {
                    $pull: { dislikedUsers: uid },
                    $inc: { dislikeCount: -1 }
                },
                { new: true, runValidators: true }
            );

            return updatedVideo;

        } catch (error) {
            console.error('An Error has occured:', error);
        }

    }

    /**
     * Increments the view count for a video
     * @param vid VideoID
     * @returns Video view count
     */

    incrementViewCount = async (vid: string) => {

        try {
            const newVideo = await Video.findByIdAndUpdate(
                vid,
                {
                    $inc: { viewCount: 1 }
                },
                { new: true, runValidators: true }
            );
            return newVideo?.viewCount;
        } catch (error) {
            console.error('Error incrementing view count:', error);
            return null;
        }
    }

    /**
     * Retrieves the view count of the given video
     * @param vid VideoID
     * @returns ViewCount
     */

    retViewCount = async (vid: string) => {
        try {
            const video = await Video.findById(vid, 'viewCount');
            return video?.viewCount;
        } catch (error) {
            console.error('Error retrieving view count:', error);
            return null;
        }
    }

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