import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: 'routes.env'});

const router = express.Router();

router.get('/', (req, res) => {
    
    console.log('Client Connected!');

    const tempPath = process.env.TEMP || process.env["TEMP"] || '/Users/anishkurani/Documents/Coding-Stuff/NOVA/backend/nodejs-web-server/public/temp.html'

    // res.json({Test : "Response"});

    res.sendFile(tempPath);

});

export default router;