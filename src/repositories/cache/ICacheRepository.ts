


export interface ICacheRepository<T>{
    set(key:string,value:T,ttlSeconds?:number):Promise<void>
    get(key:string):Promise<T|null>
    delete(key:string):Promise<void>
    exists(key:string):Promise<true|false>
}