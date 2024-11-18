import express, { Express, NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import DataBaseService from '../database/mongo.service';
import jwt from 'jsonwebtoken';

interface UserPayload {
    UID : string;
    username : string;
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

if (!secretKey) { console.error('Secret Key:', secretKey); throw new Error ('Secret Key is Undefined!'); }

const videoStoreConfig = multer.diskStorage({

    destination : (req, file, cb) => {
        cb(null, 'uploads/videos/');
    },

    filename : (req, file, cb) => {

        cb(null, Date.now() + path.extname(file.originalname));

    },

});

const videoUpload = multer({ storage : videoStoreConfig });

const pfpStoreConfig = multer.diskStorage({

    destination : (req, file, cb) => {
        cb(null, 'uploads/images/');
    },

    filename : (req, file, cb) => {

        cb(null, file.originalname);

    },

});

const pfpUpload = multer({ storage : pfpStoreConfig });

const vidThumbnailStoreConfig = multer.diskStorage({

    destination : (req, file, cb) => {
        cb(null, 'uploads/thumbnails/');
    },

    filename : (req, file, cb) => {

        cb(null, file.originalname);

    },

});

const thumbnailUpload = multer({ storage : vidThumbnailStoreConfig });

/**
 * Middleware to authenticate and validate JWT token
 * @param req Request
 * @param res Response
 * @param next Next Function
 * @returns Void
 */

const authToken = async (req : Request, res : Response, next : NextFunction) => {

    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];

        if(!token) { res.status(401).json({ message : 'Access Denied!' }); return; }

        const decoded = jwt.verify(token, secretKey) as UserPayload;
        req.user = decoded;
        next();

    } catch (err) {

        if (err instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ message : 'Invalid Token!' })
            return;
        }

        res.status(500).json({ message : 'Internal Server Error!' });
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
            pfp_src : 'temp' //pfp_src
    
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
                res.status(400).json({ message : 'Invalid Password!' }); 
                return; 
        }

        const token = jwt.sign({ UID : user?.id, username : user?.username }, secretKey, { expiresIn : '1h' });

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

router.post('/profile/upload', authToken, pfpUpload.single('profile_pic'), async (req : any, res : any) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded!');
    }

    // console.log(req.file.filename);
    // console.log(path.extname(req.file.originalname));

    try {

        await MongoService.updateUserPFP(String(req.user.UID), req.file.originalname);

        res.sendStatus(200);

    } catch(error) {
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

router.post('/:cid/upload', authToken, videoUpload.single('video_file'), async (req : any, res : any) => {

    if (!req.file) {
        res.status(400).send('No file uploaded.');
    }

    try {

        const { title, description, tags, channel_name } = req.body;

        const filename = req.file.filename;

        // console.log(title, description, tags, channel_name, filename);

        await MongoService.uploadVideo({
            title : title,
            description : description,
            tags : tags,
            user : String(req.user.UID),
            channel_name : channel_name,
            channel_id : req.params.cid
        }, filename);
    
        res.status(200).send(`File uploaded: ${ req.file.filename }`);

    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }

});

// Endpoint to upload a thumbnail to a video

router.post('/:vid/thumbnail/upload', authToken, thumbnailUpload.single('thumbnail'), async (req : any, res: any) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded!');
    }

    //console.log(req.params.vid);

    try {

        await MongoService.updateVideoThumbnail(String(req.user.UID), req.params.vid, req.file.originalname);

        res.sendStatus(200);

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

    if(query.trim().length != 0) {

        const videoArray = await MongoService.queryVideoByRegex(query);

        console.log(videoArray);

        try {
            const videoArray = await MongoService.queryVideoByRegex(query);
            console.log('Search results:', videoArray);
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

    res.json({ message : 'THIS IS A PROTECTED ROUTE!', user : req.user });

});



export default router;