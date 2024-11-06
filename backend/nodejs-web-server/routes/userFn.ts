import express, { Express, NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import DataBaseService from '../database/mongo.service';

const MongoService = new DataBaseService();

const router = express.Router();

const storeConfig = multer.diskStorage({

    destination : (req, file, cb) => {
        cb(null, 'uploads/');
    },

    filename : (req, file, cb) => {

        cb(null, Date.now() + path.extname(file.originalname));

    },

});

const upload = multer({ storage : storeConfig });

router.post('/upload', upload.single('file'), async (req : any, res : any) => {

    const file = req.file;
    const { title, description, tags } = req.body;

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // console.log(title);

    MongoService.insertVideo({
        title : title,
        description : description,
        tags : tags,
        user : 'noobslayer69'
    });

    res.send(`File uploaded: ${ req.file.filename }`);

});

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

    MongoService.createUser({

        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        username: username,
        pfp_src : 'temp' //pfp_src

    });


    res.sendStatus(200);

});

export default router;