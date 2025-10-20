import { createClient, type RedisClientType } from 'redis';
import { REDIS_URL } from './constants.js';

let redisClient: RedisClientType;
let isReady = false;

async function connectToRedis() {
  if (isReady) {
    return;
  }
  if (!REDIS_URL) {
    throw new Error('REDIS_URL 환경변수가 설정되지 않았습니다.');
    // throw new InternalServerError('REDIS_URL 환경변수가 설정되지 않았습니다.');
  }

  redisClient = createClient({
    url: REDIS_URL,
  });

  redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));
  redisClient.on('connect', () => console.log('Connecting to Redis...'));
  redisClient.on('ready', () => {
    isReady = true;
    console.log('Redis client is ready');
  });

  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
}

connectToRedis();

export { redisClient };
