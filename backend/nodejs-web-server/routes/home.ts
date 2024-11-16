import express, { Express, Request, Response } from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    
    console.log('Client Connected!');

    const tempPath : string = process.env.TEMP_FILE || 'undefined'  // || "E:/Coding-Stuff/NOVA/backend/nodejs-web-server/public/temp.html"

    // console.log(tempPath);

    res.sendFile(tempPath);

});

export default router;