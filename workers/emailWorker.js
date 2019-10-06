require('dotenv').config();

const amqplib = require('amqplib');
const EmailValidationService = require('../services/EmailValidationService');
const EmailValidation = require('../models').EmailValidation;
const rabbitmq = require('../common/config').rabbitmq;
// const CONN_URL = 'amqp://gsgmnvnl:NITe9ThLkXQvKVLl7L6gEtMllb6obQmw@dinosaur.rmq.cloudamqp.com/gsgmnvnl';
// const CONN_URL = 'amqp://guest:guest@my-rabbit:5672'
// const CONN_URL = 'amqp://localhost:5672';

const start = async () => {
	try {
		const connection = await amqplib.connect(rabbitmq.connectionUrl);
		const channel = await connection.createChannel();

		channel.consume('email-validation', async (msg) => {
			console.log('message arrived');
			console.log(msg);
			console.log(msg.content.toString());
			const jobId = msg.properties.correlationId;
			const content = JSON.parse(msg.content.toString());

			const validationResults = await EmailValidationService.checkEmailValidity(content.email);

			await EmailValidation.update(
				{ isValid: validationResults.isValid, confidence: validationResults.confidence, isProcessed: true },
				{ where: { email: content.email } }
			);

		}, { noAck: true });
	} catch(error) {
		console.log('error');
		console.log(error);
	}

}

start();
