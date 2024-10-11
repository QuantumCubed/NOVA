import express, { Express, Request, Response } from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    
    console.log('Client Connected!');

    res.json({Test : "Response"});

})

export default router;