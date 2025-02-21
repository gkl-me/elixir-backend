import path from 'path'
import { createLogger, format, transports } from 'winston'

const logDir = path.join(__dirname,'../../' ,'logs')

const logger =  createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
        format.printf(({timestamp,level,message}) => `${timestamp} [${level.toUpperCase()}]: ${message}`),
    ),
    transports: [
        new transports.File({
            filename: path.join(logDir, 'app.log'),
        })
    ]
})


export default logger;