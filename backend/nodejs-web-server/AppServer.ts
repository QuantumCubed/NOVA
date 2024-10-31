import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import home from './routes/home';
import userFx from './routes/userFx';

const LAN = false; // false = local
const app = express();
const port = 3000;
const IP = LAN ? '0.0.0.0' : '127.0.0.1';

// app.use(express.static('public'));
app.use(cors());
app.use('/', home);
app.use('/upload', userFx);

app.listen(port, IP, () => {
    console.log(`Example app listening on http://${IP}:${port}`);
});