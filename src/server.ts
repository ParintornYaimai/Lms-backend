import express from 'express'
import cors, { CorsOptions } from 'cors'
import dotenv from 'dotenv'
import cookiePaser from 'cookie-parser'
import connectToDb from '../config/connectToDB';
import log from '../src/util/logger'
import {initRedis} from '../config/connectToRedis'
import generatesecret from './util/cornJob'
import {authRateLimiter, publicRateLimiter} from './util/rateLimit'

//route
import authRouter from '../src/modules/auth/auth.routes'
import noteRouter from '../src/modules/note/note.routes'
dotenv.config();

const app = express()


//cors option
const allowedOrigins = ['http://localhost:5500', ];
const corsOption: CorsOptions  = {
    origin: (origin,callback) =>{
        if(!origin || allowedOrigins.includes(origin)  ){
            callback(null, true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    credentials: true,
}


//middleware
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookiePaser())


//route
app.use('/api/auth',authRateLimiter,authRouter);
app.use('/api/note',publicRateLimiter,noteRouter);


const port = process.env.PORT
app.listen(port,async()=> {
    log.info(`server start on port: ${port}`)
    await connectToDb()
    await initRedis()
    generatesecret()
})