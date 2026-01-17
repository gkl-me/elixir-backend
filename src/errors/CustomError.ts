export class CustomError extends Error{
    constructor(
        public message: string, 
        public statusCode: number,
        public errorCode?:string
    ) {
        super(message)
        this.statusCode = statusCode
        this.errorCode = errorCode
        Error.captureStackTrace(this)
    }
}