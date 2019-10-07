const Telnet = require('telnet-client');
const nslookup = require('../utils/nslookup');
const validators = require('../utils/validators');

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
    const isValidRegexp = validators.isValidEmail(email);

    console.log('isValidRegexp');
    console.log(isValidRegexp);

    if (!isValidRegexp) {
        return await createResponseAndCloseConnection({ isValid: false, confidence: 1});
    }

    const [_, domain] = email.split('@');

    let connection;

    try {
        const lookupResults = await nslookup(domain, 'mx');
        console.log('lookupResults');
        console.log(lookupResults);

        if (lookupResults.length === 0 || (lookupResults.length === 1 && lookupResults[0] === '')) {
            return await createResponseAndCloseConnection({ isValid: false, confidence: 1});
        }

        const address = lookupResults[0];
        connection = new Telnet();
        await connection.connect(getTelnetConnectionOptions(address));

        const heloResponse = await connection.send('HELO hi\r');
        console.log('heloResponse');
        console.log(heloResponse);
        if (!heloResponse.startsWith(SUCCESS_STATUS)) {
            return await createResponseAndCloseConnection({ isValid: false, confidence: 0.66 }, connection);
        }

        const mailFromResponse = await connection.send('MAIL FROM: <test@example.com>\r');
        console.log('mailFromResponse');
        console.log(mailFromResponse);
        if (!mailFromResponse.startsWith(SUCCESS_STATUS)) {
            return await createResponseAndCloseConnection({ isValid: false, confidence: 0.66 }, connection);
        }
        const rcptToResponse = await connection.send(`RCPT TO: <${email}>\r`);
        console.log('rcptToResponse');
        console.log(rcptToResponse);

        if (rcptToResponse.startsWith(SUCCESS_STATUS)) {
            return await createResponseAndCloseConnection({ isValid: true, confidence: 1 }, connection);
        } else if (rcptToResponse.startsWith(USER_DOES_NOT_EXIST_STATUS)) {
            return await createResponseAndCloseConnection({ isValid: false, confidence: 1 }, connection);
        } else {
            return await createResponseAndCloseConnection({ isValid: false, confidence: 0.33 }, connection);
        }

    } catch(error) {
        console.log('error');
        console.log(error);

        return await createResponseAndCloseConnection({ isValid: false, confidence: 0.5 }, connection);
    }
};


module.exports.checkEmailValidity = checkEmailValidity;
