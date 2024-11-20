import express, { Express, NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import DataBaseService from '../database/mongo.service';
import jwt from 'jsonwebtoken';

interface UserPayload {
    UID: string;
    username: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload
        }
    }
}



const MongoService = new DataBaseService();
const router = express.Router();
const sk = process.env.CRYPT_SK;

const secretKey = 'my-secret-key';
console.log('Secret Key:', sk)

if (!secretKey) { console.error('Secret Key:', secretKey); throw new Error('Secret Key is Undefined!'); }

const videoStoreConfig = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/videos/');
    },

    filename: (req, file, cb) => {

        cb(null, Date.now() + path.extname(file.originalname));

    },

});

const videoUpload = multer({ storage: videoStoreConfig });

const pfpStoreConfig = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/images/');
    },

    filename: (req, file, cb) => {

        cb(null, file.originalname);

    },

});

const pfpUpload = multer({ storage: pfpStoreConfig });

const vidThumbnailStoreConfig = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/thumbnails/');
    },

    filename: (req, file, cb) => {

        cb(null, file.originalname);

    },

});

const thumbnailUpload = multer({ storage: vidThumbnailStoreConfig });

const channelStoreConfig = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/channel_rec/');
    },

    filename: (req, file, cb) => {

        cb(null, file.originalname);

    },

});

const channel_visuals = multer({ storage: channelStoreConfig });

/**
 * Middleware to authenticate and validate JWT token
 * @param req Request
 * @param res Response
 * @param next Next Function
 * @returns Void
 */

const authToken = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];

        if (!token) { res.status(401).json({ message: 'Access Denied!' }); return; }

        const decoded = jwt.verify(token, secretKey) as UserPayload;
        req.user = decoded;
        next();

    } catch (err) {

        if (err instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ message: 'Invalid Token!' })
            return;
        }

        res.status(500).json({ message: 'Internal Server Error!' });
        return;

    }
}

// Endpoint to create a new user

router.post('/user/add', async (req, res) => {

    const {
        first_name,
        last_name,
        email,
        password,
        username
        //pfp_src,
    } = req.body;

    try {

        await MongoService.createUser({

            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            username: username,
            pfp_src: 'temp' //pfp_src

        });

        res.sendStatus(200);

    } catch (error) {
        console.error('Error adding new user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint to authenticate user login

router.post('/auth/login', async (req, res) => { // AforAppleBforBall

    const { email_log, password_log } = req.body;

    // console.log(email_log, password_log);

    try {
        const user = await MongoService.loginAuth(String(email_log), String(password_log));

        if (!user) {
            res.status(400).json({ message: 'Invalid Password!' });
            return;
        }

        const token = jwt.sign({ UID: user?.id, username: user?.username }, secretKey, { expiresIn: '1h' });

        console.log('Login Sucessful! JWT Token Generated!');

        res.status(200).json(token);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
    // res.cookie('token', token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: 'strict'
    // });
});

// Endpoint to upload a user's profile picture

router.post('/profile/upload', authToken, pfpUpload.single('profile_pic'), async (req: any, res: any) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded!');
    }

    // console.log(req.file.filename);
    // console.log(path.extname(req.file.originalname));

    try {

        await MongoService.updateUserPFP(String(req.user.UID), req.file.originalname);

        res.sendStatus(200);

    } catch (error) {
        console.error('Error uploading profile:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }

});

// Endpoint to create a new channel

router.post('/channel/create', authToken, async (req, res) => {

    try {

        const UID = String(req.user?.UID);

        // console.log(UID, req.body);

        await MongoService.createChannel({
            channel_owner: UID,
            channel_name: String(req.body.channel_name),
            description: String(req.body.channel_description)
        });

        res.sendStatus(200);

    } catch (error) {
        console.error('Error creating channel:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }

});

// Endpoint to upload a video to the specified channel

// router.post('/channel/:cid/upload', authToken, videoUpload.single('video_file'), async (req: any, res: any) => {

//     if (!req.file) {
//         res.status(400).send('No file uploaded.');
//     }

//     try {

//         const { title, description, tags, channel_name } = req.body;

//         const filename = req.file.filename;

//         // console.log(title, description, tags, channel_name, filename);

//         await MongoService.uploadVideo({
//             title: title,
//             description: description,
//             tags: tags,
//             user: String(req.user.UID),
//             channel_name: channel_name,
//             channel_id: req.params.cid
//         }, filename);

//         res.status(200).send(`File uploaded: ${req.file.filename}`);

//     } catch (error) {
//         console.error('Error uploading video:', error);
//         res.status(500).json({ message: 'Internal Server Error!' });
//     }

// });

// [   { name : 'channel_icon', maxCount : 1 },
//     { name : 'channel_banner', maxCount : 1 }
// ]), async (req, res) => {

router.post('/channel/:cid/upload', authToken, videoUpload.fields(
    [
        { name : 'video_file', maxCount : 1 },
        { name : 'thumbnail', maxCount : 1 },
    ]), async (req: any, res: any) => {

        if (!req.files) {
            res.status(400).send('No files uploaded.');
        }

        try {

            const { title, description, tags, channel_name } = req.body;

            // const filename = req.file.filename;

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (!files['video_file']) {
                res.status(400).send('Video File Required!');
                return;
            }

            const vidFileName = files['video_file'][0].filename;

            if (!files['thumbnail']) {
                await MongoService.uploadVideo({
                    title: title,
                    description: description,
                    tags: tags,
                    user: String(req.user.UID),
                    channel_name: channel_name,
                    channel_id: req.params.cid
                }, vidFileName, undefined);

                res.status(200).json({ message : `Video Uploaded!` });
                return;
            }

            // console.log(title, description, tags, channel_name, filename);

            

            const thumbnailFileName = files['thumbnail'][0].filename;

            await MongoService.uploadVideo({
                title: title,
                description: description,
                tags: tags,
                user: String(req.user.UID),
                channel_name: channel_name,
                channel_id: req.params.cid
            }, vidFileName, thumbnailFileName);

            res.status(200).json({ message : `Video and Thumbnail Uploaded!` });

        } catch (error) {
            console.error('Error uploading video:', error);
            res.status(500).json({ message: 'Internal Server Error!' });
        }
    
});

// Endpoint to upload a thumbnail to a video

router.post('/video/:vid/thumbnail/upload', authToken, thumbnailUpload.single('thumbnail'), async (req: any, res: any) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded!');
    }

    //console.log(req.params.vid);

    try {

        await MongoService.updateVideoThumbnail(String(req.user.UID), String(req.params.vid), String(req.file.originalname));

        res.status(200).json({ message: 'Thumbnail Uploaded!' });

    } catch (error) {
        console.error('Error uploading thumbnail:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }

});

// Endpoint to return user profile

router.get('/user/profile', authToken, async (req, res) => {

    try {

        const UID = String(req.user?.UID);

        const user = await MongoService.queryUserData(UID);

        if (!user) {
            res.status(404).json({ message: 'User not found!' });
            return;
        }

        // Exclude sensitive information like password

        // const { first_name, last_name, email, channels_owned, username, acc_creation_date } = user;

        // res.status(200).json({
        //     first_name,
        //     last_name,
        //     email,
        //     channels_owned,
        //     username,
        //     acc_creation_date,
        // });

        res.status(200).json(user);

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }
});

// Endpoint to search for videos

router.get('/search', async (req, res) => {

    const query = String(req.query.search);

    console.log('Search query:', query);

    if (query.trim().length != 0) {

        const videoArray = await MongoService.queryVideoByRegex(query);

        // console.log(videoArray);

        try {
            const videoArray = await MongoService.queryVideoByRegex(query);
        //    console.log('Search results:', videoArray);
            res.status(200).json(videoArray);
        } catch (error) {
            console.error('Error fetching search results:', error);
            res.status(500).json({ message: 'Internal Server Error!' });
        }
    } else {
        res.status(400).json({ message: 'Search query cannot be empty'! });
    }

});

router.get('/channels', authToken, async (req: Request, res: Response) => {

    try {

        const channelsOwned = await MongoService.queryUserChannels(String(req.user?.UID));

        if (channelsOwned?.length === 0) {
            res.status(200).json([]); // User owns 0 channels
            return;
        }

        res.status(200).json(channelsOwned);

    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }

});

router.get('/:uid/profile_picture', async (req, res) => {

    try {

        const pfp_path = await MongoService.queryUserPFP(String(req.params.uid))

        if (!pfp_path || pfp_path === '') {
            res.status(404).json({ message: 'Specified Resource Not Found!' });
            return;
        }

        res.status(200).sendFile(pfp_path);

    } catch (error) {
        console.error('Error fetching user pfp:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }

});

router.get('/channels/name/:name', async (req: any, res: any) => {
    const { name } = req.params;
    try {
        const channel = await MongoService.fetchChannelByName(String(name));
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        res.status(200).json(channel);
    } catch (error) {
        console.error('Error fetching channel by name:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/channels/:id/description', authToken, async (req: any, res: any) => {
    const { id } = req.params;
    const { description } = req.body;

    if (typeof description !== 'string' || description.trim().length === 0) {
        return res.status(400).json({ message: 'Description cannot be empty.' });
    }

    try {
        const channel = await MongoService.queryChannelByID(String(id));

        if (!channel) {
            return res.status(404).json({ message: 'Channel not found.' });
        }

        // Check if the authenticated user is the owner of the channel
        if (channel.owner !== req.user?.UID) {
            return res.status(403).json({ message: 'You are not authorized to edit this channel.' });
        }

        // Update the description
        const updatedChannel = await MongoService.updateChannelDescription(String(id), String(description).trim());

        res.status(200).json({ message: 'Channel description updated successfully.', updatedChannel });
    } catch (error) {
        console.error('Error updating channel description:', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

router.post('/subscribe/:cid', authToken, async (req, res) => {

    if (!req.user) { 
        res.status(403).json({ message : 'You need to be signed in! '});
        return;
    }

    try {
        const result = await MongoService.userSubHandler(String(req.user.UID), String(req.params.cid));
        res.status(200).json(result);
        return;
    } catch (error) {
        console.error('Unable to (un)subscribe:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
        return;
    }

});

router.get('/channels/:channelId/isSubscribed', authToken, async (req, res) => {

    if (!req.user) { 
        res.status(403).json({ message : 'You need to be signed in! '});
        return;
    }

    try {
        const isSubscribed = await MongoService.isSubscribed(String(req.user.UID), String(req.params.channelId));
        res.status(200).json({ isSubscribed :  isSubscribed });
    } catch (error) {
        console.error('Unable to (un)subscribe:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }

});

router.get('/load/channels', async (req, res) => {

    try {
        const channels = await MongoService.queryAllChannels(); // Exclude v field
        res.status(200).json(channels);
    } catch (error) {
        console.error('Error fetching channels:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

});

router.post('/:vid/like', authToken, async (req, res) => {

    if (!req.user) { 
        res.status(403).json({ message : 'You need to be signed in! '});
        return;
    }

    try {

        const uid = String(req.user.UID);
        const vid = String(req.params.vid)
        const hasLiked = await MongoService.hasLiked(uid, vid);
        const hasDisliked = await MongoService.hasDisliked(uid, vid);

        if (!hasLiked && hasDisliked) {

            await MongoService.videoDislikeHandler(uid, vid);

            const result = await MongoService.videoLikeHandler(uid, vid);

            res.status(200).json(result);

            return;

        }

        const result = await MongoService.videoLikeHandler(uid, vid);
        res.status(200).json(result);
        return;

    } catch (error) {
        console.error('Unable to (un)like:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
        return;
    }

});

router.post('/:vid/dislike', authToken, async (req, res) => {

    if (!req.user) { 
        res.status(403).json({ message : 'You need to be signed in! '});
        return;
    }

    try {

        const uid = String(req.user.UID);
        const vid = String(req.params.vid)
        const hasLiked = await MongoService.hasLiked(uid, vid);
        const hasDisliked = await MongoService.hasDisliked(uid, vid);

        if (!hasDisliked && hasLiked) {

            await MongoService.videoLikeHandler(uid, vid);

            const result = await MongoService.videoDislikeHandler(uid, vid);

            res.status(200).json(result);

            return;

        }

        const result = await MongoService.videoDislikeHandler(uid, vid);
        res.status(200).json(result);
        return;

    } catch (error) {
        console.error('Unable to (un)dislike:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
        return;
    }

});

router.get('/:vid/thumbnail', async (req, res) => {

    try {

        const thumbnail_path = await MongoService.queryVideoThumbnail(String(req.params.vid))
    
        if (!thumbnail_path || thumbnail_path === '') {
            res.status(404).json({ message: 'Specified Resource Not Found!' });
            return;
        }
    
        res.status(200).sendFile(thumbnail_path);
    
    } catch (error) {
        console.error('Error fetching user pfp:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }

});

router.post('/watch/:vid', async (req, res) => {

    try {

        const videoViews = await MongoService.incrementViewCount(String(req.params.vid));

        res.status(200).json({ views : videoViews });

    } catch (error) {
        console.error('Unable to increment views:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }

});

router.get('/retrieve/views/:vid', async (req, res) => {

    try {

        const views = await MongoService.retViewCount(String(req.params.vid));

        res.status(200).json({ views : views });
    } catch (error) {
        console.error('Unable to retrieve views:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }

});

router.post('/channel/:cid/visuals/upload', authToken,
    channel_visuals.fields(
        [   { name : 'channel_icon', maxCount : 1 },
            { name : 'channel_banner', maxCount : 1 }
        ]), async (req, res) => {

            if (!req.files) {
                res.status(400).send('No files uploaded!');
                return;
            }

            // console.log(req.files);

            try {

                const files = req.files as { [fieldname: string]: Express.Multer.File[] };

                // console.log(files['channel_icon']);
                // console.log(files['channel_banner']);

                if (!files['channel_icon']) {
                    const channelBanner = files['channel_banner'][0].originalname
                    await MongoService.updateChannelVisuals(String(req.user?.UID), String(req.params.cid), undefined, String(channelBanner));
                    res.status(200).json({ message: 'Channel Banner Uploaded!' });
                    return;
                }

                if (!files['channel_banner']) {
                    const channelIcon = files['channel_icon'][0].originalname
                    await MongoService.updateChannelVisuals(String(req.user?.UID), String(req.params.cid), String(channelIcon), undefined);
                    res.status(200).json({ message: 'Channel Icon Uploaded!' });
                    return;
                }
                const channelIcon = files['channel_icon'][0].originalname
                const channelBanner = files['channel_banner'][0].originalname
                await MongoService.updateChannelVisuals(String(req.user?.UID), String(req.params.cid), String(channelIcon), String(channelBanner));
                res.status(200).json({ message: 'Channel Visuals Uploaded!' });
        
            } catch (error) {
                console.error('Error uploading visuals:', error);
                res.status(500).json({ message: 'Internal Server Error!' });
            }
});

router.get('/channel/:cid/channel_icon', async (req, res) => {

    try {
        const icon_src = await MongoService.queryChannelIcon(String(req.params.cid))

        if (!icon_src || icon_src === '') {
            res.status(404).json({ message: 'Specified Resource Not Found!' });
            return;
        }

        res.status(200).sendFile(icon_src);
    } catch (error) {
        console.error('Unable to fetch channel_icon:', error);
    }
});

router.get('/channel/:cid/channel_banner', async (req, res) => {

    try {
        const banner_src = await MongoService.queryChannelBanner(String(req.params.cid))

        if (!banner_src || banner_src === '') {
            res.status(404).json({ message: 'Specified Resource Not Found!' });
            return;
        }

        res.status(200).sendFile(banner_src);
    } catch (error) {
        console.error('Unable to fetch channel_banner:', error);
    }
});

// router.post('/:vid/comment', authToken, async (req, res) => {



// });

// router.get('/watch/:vID', async (req, res) => {

//     const videoID = String(req.params.vID);

//     // console.log(videoID);

//     const video_src = await MongoService.queryVideoByID(videoID);

//     console.log(video_src);

//     res.status(200).send(video_src);

// });

// WIP

router.get('/load/home', async (req, res) => {

    const homeVideos = await MongoService.nVidQuery(12);

});

// WIP

router.get('/protected', authToken, (req, res) => {

    res.json({ message: 'THIS IS A PROTECTED ROUTE!', user: req.user });

});

export default router;