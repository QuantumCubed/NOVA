import express, { Express, Request, Response } from 'express';

const LAN = false; // false = local
const app = express();
const port = 3000;
const IP = LAN ? '0.0.0.0' : '127.0.0.1';

app.get('/', (req, res) => {
    
    res.json({Test : "Response"});
})

app.listen(port, IP, () => {
    console.log(`Example app listening on http://${IP}:${port}`)
})