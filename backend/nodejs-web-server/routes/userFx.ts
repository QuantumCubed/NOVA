import express, { Express, NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

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

router.post('/upload', upload.single('file'), (req : any, res : any) => {

    const file = req.file;
    const { title, description, tags } = req.body;

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    console.log(title);

    res.send(`File uploaded: ${ req.file.filename }`);

});

export default router;