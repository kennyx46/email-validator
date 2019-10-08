require('dotenv').config();

const EmailService = require('../services/EmailService');
const queue = require('../common/queue');
const logger = require('../common/logger');

const start = async () => {
	try {
		logger.info('Worker started successfully');

		queue.consume(async (msg) => {
			try {
				logger.info('Processing message', { messageId: msg.properties.correlationId})
				const jobId = msg.properties.correlationId;
				const content = JSON.parse(msg.content.toString());

				await EmailService.validateEmail(content.email, { shouldSave: true });
			} catch (error) {
				logger.error('Message processing Error', { error });
				await EmailService.deleteEmail(content.email);
			}
		});

	} catch(error) {
		logger.error('Queue Error', { error });
	}

}

start();
