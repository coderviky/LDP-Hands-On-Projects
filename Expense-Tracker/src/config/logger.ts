// logger functions

import { pino } from 'pino'


// create logger with pino
export const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
    }
})