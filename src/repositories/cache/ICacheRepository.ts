


export interface ICacheRepository<T>{
    set(key:string,value:T,ttlSeconds?:number):Promise<void>
    get(key:string):Promise<T|null>
    delete(key:string):Promise<void>
    exists(key:string):Promise<true|false>,
    addSet(key:string,...values:string[]):Promise<void>,
    remSet(key:string,value:string):Promise<void>
    getMembers(key:string):Promise<string[]>
}