require('dotenv').config();

const EmailService = require('../services/EmailService');
const queue = require('../common/queue');

const start = async () => {
	try {
		console.log('Worker started successfully');

		queue.consume(async (msg) => {
			console.log('Message arrived');
			console.log(msg);
			console.log(msg.content.toString());
			const jobId = msg.properties.correlationId;
			const content = JSON.parse(msg.content.toString());

			await EmailService.validateEmail(content.email, { shouldSave: true });
		});

	} catch(error) {
		console.log('error');
		console.log(error);
	}

}

start();
