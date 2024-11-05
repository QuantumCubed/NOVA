import mongoose, { mongo, MongooseError } from 'mongoose';
import Video from './models/Video';

interface VideoMetaData {

    title : String,
    description : String,
    tags : [String],
    date : number,
    user : String

}

class DataBaseService {
    
    private readonly URI;

    constructor () {
        this.URI  = process.env.URI || process.env["URI"] || 'mongodb://localhost:27017/';
    }
    
    establishDBConnection = async () => {

        try {
            await mongoose.connect(this.URI,
                { dbName : 'TempDB' }
            );
            console.log('Database Connection Sucessful! ✅')
        }

        catch (err : any) {
            console.error('DB Connection has failed!', err.message);
        }
    }

    insertVideo = async (vidMeta : VideoMetaData) => {
        /*
        await Song.create({
            song : 'ourheartscollide',
            author : 'Unknown',
            tags : ['Muselk', 'TF2', 'Team Fortress 2'],
            date_published : new Date('January 15, 1995 03:24:00'),
            thumbnail_Source : 'Not Set',
            audio_Source : 'Not Set'
        });
        */

        await Video.create({

            title : vidMeta.title,
            description: vidMeta.description,
            tags : vidMeta.tags,
            date_published : vidMeta.date,
            user : vidMeta.user,
            thumbnail_src : 'temp',
            video_src : 'temp',
            likeCount: 0,
            dislikeCount: 0,
            viewCount: 0,
            comments: [],

        });

        console.log('Video added to DB!');
    }

    videoQuery = async (query : string) => {
        try {
            const videoArray = await Video.find({
                $or: [
                    { title: new RegExp(query, 'i') },
                    { user: new RegExp(query, 'i') },
                    { tags: new RegExp(query, 'i') }
                ]
            });
            // console.log(videoArray);
            return videoArray;

        } catch (error) {
            console.error('Error fetching videos:', error);
            throw error;
        }
    }

    queryByID = async (query : string) => {
        const video = await Video.findById(query);
        return video;
    }

    nVidQuery = async (n : number) => {
        const videoArray = await Video.find().limit(n)
        return videoArray;
        //console.log(songsArray);
    }

    findVideo = async () => {
        const video : any = await Video.findOne({});
        console.log(video);
        return video;
    }

    disconnectDB = async () => {
        mongoose.connection.close();
    }
}

export default DataBaseService;