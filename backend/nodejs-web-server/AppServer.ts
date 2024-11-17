import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import home from './routes/home';
import userFn from './routes/userFn';
import DataBaseService from './database/mongo.service';
import dotenv from 'dotenv';

dotenv.config();

const LAN = true; // false = local
const app = express();
const port = 3000; // change to 3001
const IP = LAN ? '0.0.0.0' : '127.0.0.1';

// app.use(express.static('public'));
app.use(express.json());
app.use(cors({
        origin: 'http://localhost:3000', // Your frontend origin
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.urlencoded({ extended: true }));
app.use('/', home, userFn); // URL = /
// app.use('/upload', userFx); URL = /upload

const MongoService = new DataBaseService();
MongoService.establishDBConnection();

app.listen(port, IP, () => {
    console.log(`Example app listening on http://${IP}:${port}`);
});
