const express = require('express');
const EmailService = require('../services/EmailService');

const validateEmailSync = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		res.status(422).json({ "error": "no email to validate" });
		return;
	}

	const validationResults = await EmailService.validateEmail(email, { shouldSave: false });

  	res.json(validationResults);
};

const validateEmailAsync = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		res.status(422).json({ "error": "no email to validate" });
		return;
	}

	const emailEntry = await EmailService.validateEmailAsync(email);

  	res.json({ inProgress: true, jobId: emailEntry.jobId });
};

const validateEmail = async (req, res) => {
	const { email } = req.query;

	if (!email) {
		res.status(422).json({ "error": "no email param" });
		return;
	}

	const emailEntry = await EmailService.findEmail(email);

	if (!emailEntry) {
		res.json({ error: true, reason: 'No such email' });
		return;
	}

	const validateEmailResponseDto = {
		email: emailEntry.email,
		isValid: emailEntry.isValid,
		confidence: emailEntry.confidence,
		isProcessed: emailEntry.isProcessed,
	};

	res.json(validateEmailResponseDto);
};

module.exports = {
	validateEmail,
	validateEmailAsync,
	validateEmailSync,
};
