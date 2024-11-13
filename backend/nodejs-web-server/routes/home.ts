import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: 'routes.env'});

const router = express.Router();

router.get('/', (req, res) => {
    
    console.log('Client Connected!');

    //const tempPath = process.env.TEMP || process.env["TEMP"] || `E:\\Coding-Stuff\\NOVA\\backend\\nodejs-web-server\\public\\temp.html`
    
    // '/Users/anishkurani/Documents/Coding-Stuff/NOVA/backend/nodejs-web-server/public/temp.html'

    // res.json({Test : "Response"});

    //res.sendFile(tempPath);

    //res.sendFile('/Users/anishkurani/Documents/Coding-Stuff/NOVA/backend/nodejs-web-server/public/temp.html');

    res.sendFile(`E:\\Coding-Stuff\\NOVA\\backend\\nodejs-web-server\\public\\temp.html`);

});

export default router;