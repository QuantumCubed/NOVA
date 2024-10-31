import express, { Express, Request, Response } from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    
    console.log('Client Connected!');

    // res.json({Test : "Response"});
    
    res.sendFile(`E:\\Coding-Stuff\\NOVA\\backend\\nodejs-web-server\\public\\temp.html`);


})

export default router;