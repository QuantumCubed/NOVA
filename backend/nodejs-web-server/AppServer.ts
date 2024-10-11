import express, { Express, Request, Response } from 'express';
import home from './routes/home';

const LAN = false; // false = local
const app = express();
const port = 3000;
const IP = LAN ? '0.0.0.0' : '127.0.0.1';

app.use('/', home);

app.listen(port, IP, () => {
    console.log(`Example app listening on http://${IP}:${port}`);
})