import express, { Request, Response, NextFunction } from 'express'
import cors, { CorsOptions } from 'cors'
import dotenv from 'dotenv'
import cookiePaser from 'cookie-parser'
import connectToDb from '../config/connectToDB';
import log from '../src/util/logger'
import {initRedis} from '../config/connectToRedis'
import generatesecret from '../src/util/corJob'

//route
import authRouter from '../src/modules/auth/auth.routes'
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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}


//middleware
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookiePaser())

//route
app.use('/api/auth',authRouter);



const port = process.env.PORT
app.listen(port,async()=> {
    log.info(`server start on port: ${port}`)
    await connectToDb()
    await initRedis()
    generatesecret()
})