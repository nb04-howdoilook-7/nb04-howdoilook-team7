import { createClient } from 'redis';

let redisClient;
let isReady = false;

async function connectToRedis() {
  if (isReady) {
    return;
  }

  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));
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
