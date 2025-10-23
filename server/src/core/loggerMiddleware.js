// middlewares/loggerMiddleware.js
const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Giữ lại dữ liệu để log sau khi request hoàn tất
    const { method, originalUrl, ip, headers, body, query } = req;

    // Lưu tạm dữ liệu response để log
    const oldSend = res.send;
    let responseBody;
    res.send = function (data) {
        responseBody = data;
        oldSend.apply(res, arguments);
    };

    res.on('finish', () => {
        const duration = Date.now() - start;

        // Chỉ log phần user-agent và ip chính
        const ua = headers['user-agent'] || '';
        const shortIp = ip.replace('::ffff:', '');

        // Tạo log chi tiết
        const details = {
            method,
            url: originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: shortIp,
            body,
            query,
            headers: {
                'user-agent': ua,
            },
            response: responseBody,
        };

        // Phân loại theo status code
        if (res.statusCode >= 500) {
            logger.error(`SERVER ERROR: ${method} ${originalUrl}`, details);
        } else if (res.statusCode >= 400) {
            logger.warn(`CLIENT ERROR: ${method} ${originalUrl}`, details);
        } else {
            logger.info(`SUCCESS: ${method} ${originalUrl}`, details);
        }
    });

    next();
};

module.exports = requestLogger;
