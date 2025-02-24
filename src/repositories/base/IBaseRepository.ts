export interface IBaseRepository<T>{
    create(data:Partial<T>):Promise<T>
    findAll(data:Partial<T>):Promise<T[]|null>
    findById(id:string):Promise<T|null>
    findOne(data:Partial<T>):Promise<T|null>
    update(id:string,data:Partial<T>):Promise<T|null>
    delete(id:string,data:Partial<T>):Promise<T|null>
}
