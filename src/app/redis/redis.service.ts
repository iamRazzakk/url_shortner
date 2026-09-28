import redisClient from "../../config/redis.config";

interface IParams {
  key: string;
  value: number | string;
  expiration: number;
}

const post = async (params: IParams) => {
  await redisClient.set(params.key, params.value, "EX", params.expiration);
};

const get = async (key: string) => {
  const value = await redisClient.get(key);
  return value;
};

const del = async (key: string) => {
  await redisClient.del(key);
};

const expire = async (key: string, expiration: number) => {
  await redisClient.expire(key, expiration);
};

const hset = async (key: string, field: string, value: string) => {
  await redisClient.hset(key, field, value);
};

const hsetnx = async (key: string, field: string, value: string) => {
  return redisClient.hsetnx(key, field, value);
};

const hget = async (key: string, field: string) => {
  const value = await redisClient.hget(key, field);
  return value;
};

const hincrby = async (key: string, field: string, value: number) => {
  return redisClient.hincrby(key, field, value);
};

export const redisService = {
  post,
  get,
  del,
  expire,
  hset,
  hsetnx,
  hget,
  hincrby,
};
