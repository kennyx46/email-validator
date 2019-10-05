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

const checkEmailValidity = async (email) => {

    const isValidRegexp = validators.isValidEmail(email);

    console.log('isValidRegexp');
    console.log(isValidRegexp);

    if (!isValidRegexp) {
        return {
            isValid: false,
            confidence: 1,
        };
    }

    const [_, domain] = email.split('@');

    try {
        const lookupResults = await nslookup(domain, 'mx');
        console.log(lookupResults);

        if (lookupResults.length === 0 || (lookupResults.length === 1 && lookupResults[0] === '')) {
            return {
                isValid: false,
                confidence: 0.66
            }
        }

        console.log('lookupResults');
        console.log(lookupResults);
        // console.log(result);
        const address = lookupResults[0];
        console.log('address');
        console.log(address);
        const connection = new Telnet();
        await connection.connect(getTelnetConnectionOptions(address));

        console.log('connect!!!');

        const heloResponse = await connection.send('HELO hi\r');
        console.log('heloResponse');
        console.log(heloResponse);
        if (!heloResponse.startsWith(SUCCESS_STATUS)) {
            return {
                isValid: false,
                confidence: 0.33
            }
        }

        const mailFromResponse = await connection.send('MAIL FROM: <test@example.com>\r');
        console.log('mailFromResponse');
        console.log(mailFromResponse);
        if (!mailFromResponse.startsWith(SUCCESS_STATUS)) {
            return {
                isValid: false,
                confidence: 0.33
            }
        }
        const rcptToResponse = await connection.send(`RCPT TO: <${email}>\r`);
        console.log('rcptToResponse');
        console.log(rcptToResponse);

        if (rcptToResponse.startsWith(SUCCESS_STATUS)) {
            return {
                isValid: true,
            }
        } else if (rcptToResponse.startsWith(USER_DOES_NOT_EXIST_STATUS)) {
            return {
                isValid: false,
                // confidence?
            }
        } else if (rcptToResponse.startsWith('5')) {
            return {
                isValid: false,
                // confidence?
            }
        }


        const endOfCon = await connection.end();
        console.log('endOfCon');
        console.log(endOfCon);

        return {
            isValid: true,
        };

    } catch(error) {
        console.log('error');
        console.log(error);
        return {
            isValid: false,
            confidence: 1
        };
    }
};


module.exports.checkEmailValidity = checkEmailValidity;
