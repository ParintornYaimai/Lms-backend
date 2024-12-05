import {createClient,RedisClientType} from 'redis'
import log from '../src/util/logger'


export let client: RedisClientType | null = null;

export const initRedis = async () => {
    try {
        client = createClient({
            socket: {
                host:`${process.env.HOST}`,
                port: 18691
            },
            password: `${process.env.REDIS_PASSWORD}`,
            username: `${process.env.REDIS_USERNAME}`,
        });

        client.on('error', (error: any) =>{
            log.error('Redis client error', error)
            console.log('Redis client error',error)
        });
        await client.connect();
        log.info('Connected to redis successfully.');
    } catch (error: any) {
        log.error("Error connecting to redis", error);
    }
}

