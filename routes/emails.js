const express = require('express');
const amqplib = require('amqplib');
const EmailValidationService = require('../services/EmailValidationService');
const router = express.Router();


const CONN_URL = 'amqp://localhost:5672';
let channel;
const start = async () => {
	try {
		const connection = await amqplib.connect(CONN_URL);
		channel = await connection.createChannel();

		// await channel.sendToQueue('email-validation', new Buffer(JSON.stringify({ email })));
	} catch(error) {
		console.log('error');
		console.log(error);
	}
}

start();


router.post('/validate-email', async (req, res) => {
	const { email } = req.body;

	const validationResults = await EmailValidationService.checkEmailValidity(email);

  	res.json(validationResults);
});

router.post('/validate-email-async', async (req, res) => {
	const { email } = req.body;



	// 1. get email from db -> if not create job
	// 2. older than 1 hour ->
			// clear validation and create job
			// just return value

	// const validationResults = await EmailValidationService.checkEmailValidity(email);
	const correlationId = parseInt(Math.random() * 1000).toString();
	const resp = await channel.sendToQueue('email-validation', Buffer.from(JSON.stringify({ email })), {
		correlationId
	})
	console.log('resp');
	console.log(resp);

  	res.json({ inProgress: true, jobId: correlationId });
});

router.get('/validate-email', async (req, res) => {
	const { email } = req.query;

	const validationResults = await EmailValidationService.checkEmailValidity(email);

  	res.json(validationResults);
});

module.exports = router;
