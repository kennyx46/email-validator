const Telnet = require('telnet-client');
const nslookup = require('../utils/nslookup');
const validators = require('../utils/validators');
const logger = require('../common/logger');

const SUCCESS_STATUS = 250;
const USER_DOES_NOT_EXIST_STATUS = 550;
const getTelnetConnectionOptions = (address) => {
    return {
        host: address,
        port: 25,
        shellPrompt: '',
        timeout: 3000
    }
};

const createResponseAndCloseConnection = async (data, connection) => {
    if (connection) {
        await connection.end();
    }
    return data;
}

const checkEmailValidity = async (email) => {
    logger.info('checkEmailValidity: validating email', { email });

    const isValidRegexp = validators.isValidEmail(email);

    logger.debug('checkEmailValidity: regexp check', { email, isValidRegexp });

    if (!isValidRegexp) {
        return await createResponseAndCloseConnection({ isValid: false, confidence: 1});
    }

    const [_, domain] = email.split('@');

    let connection;

    try {
        const lookupResults = await nslookup(domain, 'mx');
        logger.debug('checkEmailValidity: nslookup results', { email, lookupResults });

        if (lookupResults.length === 0 || (lookupResults.length === 1 && lookupResults[0] === '')) {
            return await createResponseAndCloseConnection({ isValid: false, confidence: 1});
        }

        const address = lookupResults[0];
        connection = new Telnet();
        await connection.connect(getTelnetConnectionOptions(address));

        const heloResponse = await connection.send('HELO hi\r');
        logger.debug('checkEmailValidity: heloResponse', { email, heloResponse });
        if (!heloResponse.startsWith(SUCCESS_STATUS)) {
            return await createResponseAndCloseConnection({ isValid: false, confidence: 0.66 }, connection);
        }

        const mailFromResponse = await connection.send('MAIL FROM: <test@example.com>\r');
        logger.debug('checkEmailValidity: mailFromResponse', { email, mailFromResponse });
        if (!mailFromResponse.startsWith(SUCCESS_STATUS)) {
            return await createResponseAndCloseConnection({ isValid: false, confidence: 0.66 }, connection);
        }
        const rcptToResponse = await connection.send(`RCPT TO: <${email}>\r`);
        logger.debug('checkEmailValidity: rcptToResponse', { email, rcptToResponse });

        if (rcptToResponse.startsWith(SUCCESS_STATUS)) {
            return await createResponseAndCloseConnection({ isValid: true, confidence: 1 }, connection);
        } else if (rcptToResponse.startsWith(USER_DOES_NOT_EXIST_STATUS)) {
            return await createResponseAndCloseConnection({ isValid: false, confidence: 1 }, connection);
        } else {
            return await createResponseAndCloseConnection({ isValid: false, confidence: 0.33 }, connection);
        }

    } catch(error) {
        logger.error('check validity error', { error });

        return await createResponseAndCloseConnection({ isValid: false, confidence: 0.5 }, connection);
    }
};


module.exports.checkEmailValidity = checkEmailValidity;
