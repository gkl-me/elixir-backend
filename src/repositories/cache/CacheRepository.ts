
import type IORedis from 'ioredis'
import { redisConnection } from '../../config/redis'
import { ICacheRepository } from './ICacheRepository'
import { injectable } from 'tsyringe'
import { CustomError } from '../../errors/CustomError'
import { STATUS_CODES } from '../../constants/statusCodes'
import logger from '../../middlewares/logger'


@injectable()
export class CacheRepository<T> implements ICacheRepository<T> {

    private _redis:IORedis

    constructor(){
        this._redis = redisConnection
    }

    async set(key: string, value: T, ttlSeconds?: number): Promise<void> {
        try {
            
            const data = JSON.stringify(value)

            if(ttlSeconds){
                await this._redis.set(key,data,'EX',ttlSeconds)
            }else{
                await this._redis.set(key,data)
            }

        } catch (error) {
            logger.error(error)
            throw new CustomError("Redis set error",STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async get(key: string): Promise<T | null> {
        try {
            
            const data = await  this._redis.get(key)
            if(!data) return null
            return JSON.parse(data)

        } catch (error) {
            logger.error(error)
            throw new CustomError("Redis get error",STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async delete(key: string): Promise<void> {
        try {

            await this._redis.del(key)
            
        } catch (error) {
            logger.error(error)
            throw new CustomError("Redis delete error",STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async exists(key: string): Promise<true | false> {
        try {
            
            return (await redisConnection.exists(key)) === 1;

        } catch (error) {
            logger.error(error)
            throw new CustomError("Redis exists error",STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

}