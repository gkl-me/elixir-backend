import path from 'path'
import { createLogger, format, transports } from 'winston'
import  DailyRotateFile from 'winston-daily-rotate-file'

const logDir = path.join(__dirname,'../../' ,'logs')

const logFormat = format.printf(({timestamp,level,message,stack}) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`
})

const logger =  createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
        format.errors({stack:true}),
        logFormat,
    ),
    transports: [
        new DailyRotateFile({
            filename:path.join(logDir,'error-%DATE%.log'),
            datePattern:'YYYY-MM-DD',
            level:"error",
            maxSize:'20m',
            maxFiles:'7d'
        }),
        new DailyRotateFile({
            filename:path.join(logDir,'combined-%DATE%.log'),
            datePattern:'YYYY-MM-DD',
            maxSize:'20m',
            maxFiles:"7d"
        })
    ]
})

if(process.env.NODE!='production'){
    logger.add(new transports.Console({
        level:"error",
        format: format.combine(
            format.colorize(),
            logFormat
        )
    }))
}


export default logger;