const execShellCommand = require('../utils/execShell');
// const util = require('util');
const nslookupOriginal = require('nslookup');
const Telnet = require('telnet-client');

const nslookup = (domain, type) => {
	return new Promise((resolve, reject) => {
		nslookupOriginal(domain).type('mx').end((err, addrs) => {
			if (err) {
				reject(err);
			} else {
				resolve(addrs);
			}
		})
	});
};

const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/


const checkEmailValidity = async (email) => {

	const isValidRegexp = EMAIL_REGEXP.test(email);

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
		// const result = await execShellCommand(`nslookup -q=mx ${domain}`);
		const lookupResults = await nslookup(domain, 'mx');
		console.log(lookupResults);

		if (lookupResults.length === 0 || (lookupResults.length === 1 && lookupResults[0] === '')) {
			return {
				isValid: false,
				confidence: 0
			}
		}

		console.log('lookupResults');
		console.log(lookupResults);
		// console.log(result);
		const address = lookupResults[0];
		console.log('address');
		console.log(address);
		const connection = new Telnet();
		const connector = await connection.connect({
			host: address,
			port: 25,
			shellPrompt: '',
		    timeout: 3000
		});


		console.log('connect!!!');

		const res1 = await connection.send('helo hi\r');
		console.log('res1');
		console.log(res1);
		if (!res1.startsWith('250')) {
			return {
				isValid: false,
			}
		}

		const res2 = await connection.send('mail from: <test@example.com>\r');
		console.log('res2');
		console.log(res2);
		if (!res2.startsWith('250')) {
			return {
				isValid: false,
			}
		}
		const res3 = await connection.send(`rcpt to: <${email}>\r`);
		console.log('res3');
		console.log(res3);

		if (res3.startsWith('250')) {
			return {
				isValid: true,
			}
		} else if (res3.startsWith('5')) {
			return {
				isValid: false
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
