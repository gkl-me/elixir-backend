import { Request } from "express"

declare global{
    namespace Express{
        interface Request{
            admin?:{
                id:string,
                role:string
            }
        }
    }
}


export {}