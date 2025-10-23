// logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const path = require('path');

const logDir = path.join(__dirname, 'logs');

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
    let metaData = '';

    if (Object.keys(meta).length) {
        metaData = '\n' + JSON.stringify(meta, null, 2);
    }

    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaData}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
        new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new transports.File({ filename: path.join(logDir, 'app.log') }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new transports.Console({
            format: combine(format.colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
        }),
    );
}

module.exports = logger;
