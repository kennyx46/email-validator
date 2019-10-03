const express = require('express');
const EmailValidationService = require('../services/EmailValidationService');
const router = express.Router();


router.post('/validate-email', async (req, res) => {
	console.log('here');
	console.log(req.body);
	const { email } = req.body;

	const validationResults = await EmailValidationService.checkEmailValidity(email);

  	res.json(validationResults);
});

router.get('/validate-email', async (req, res) => {
	// console.log('here');
	// console.log(req.body);
	const { email } = req.query;
	console.log('email');
	console.log(email);

	const validationResults = await EmailValidationService.checkEmailValidity(email);

  	res.json(validationResults);
});

module.exports = router;
