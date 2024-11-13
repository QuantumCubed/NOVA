import express, { Express, NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import DataBaseService from '../database/mongo.service';
import gRPC_Client from '../api/gRPC/gRPC';
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

const videoStoreConfig = multer.diskStorage({

    destination : (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename : (req, file, cb) => {

        cb(null, Date.now() + path.extname(file.originalname));

    },

});

const videoUpload = multer({ storage : videoStoreConfig });

const pfpStoreConfig = multer.diskStorage({

    destination : (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename : (req, file, cb) => {

        cb(null, Date.now() + path.extname(file.originalname));

    },

});

const pfpUpload = multer({ storage : pfpStoreConfig });

// router.post('/accout/upload', videoUpload.single('file'), async (req : any, res : any) => {

//     const file = req.file;
//     const { title, description, tags } = req.body;

//     if (!req.file) {
//         return res.status(400).send('No file uploaded.');
//     }

//     // console.log(title);

//     // MongoService.insertVideo({ // need to overall the user file sys
//     //     title : title,
//     //     description : description,
//     //     tags : tags,
//     //     user : 'noobslayer69'
//     // });

//     res.send(`File uploaded: ${ req.file.filename }`);

// });

router.get('/search', async (req, res) => {

    const query = String(req.query.search);

    console.log(query);

    if(query.trim().length != 0) {

        const videoArray = await MongoService.videoQuery(query);

        console.log(videoArray);

        res.json(videoArray);
    }


});

router.post('/user/add', async (req, res) => {

    const {
        first_name,
        last_name,
        email,
        password,
        username
        //pfp_src,
    } = req.body;

    await MongoService.createUser({

        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        username: username,
        pfp_src : 'temp' //pfp_src

    });


    res.sendStatus(200);

});

const secretKey = 'my-secret-key';

router.post('/auth/login', async (req, res) => { // AforAppleBforBall

    const { email_log, password_log } = req.body;

    // console.log(email_log, password_log);

    const user = await MongoService.loginAuth(String(email_log), String(password_log));

    if (!user) { res.status(400).json({ message : 'Invalid Password!' }); return; }

    const token = jwt.sign({ UID : user?.id, username : user?.username }, secretKey, { expiresIn : '1h' });

    res.json(token);

    // res.cookie('token', token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: 'strict'
    // });
});

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

router.post('/channel/create', authToken, (req, res) => {

    const UID = String(req.user?.UID);

    // console.log(UID, req.body);

    MongoService.createChannel({
        channel_owner: UID,
        channel_name: String(req.body.channel_name),
        description: String(req.body.channel_description)
    });

    res.sendStatus(200);

});

router.post('/upload', authToken, videoUpload.single('file'),  async (req : any, res : any) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { title, description, tags, channel } = req.body;

    const filename = req.file.filename;

    console.log(title, description, tags, channel, filename);

    MongoService.uploadVideo({
        title : title,
        description : description,
        tags : tags,
        user : String(req.user.UID),
        channel : channel
    }, filename);

    res.send(`File uploaded: ${ req.file.filename }`);

});

// router.get('/watch/:vID', (req, res) => {



// });

router.get('/protected', authToken, (req, res) => {

    res.json({ message : 'THIS IS A PROTECTED ROUTE!', user : req.user });

});



export default router;