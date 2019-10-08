const EmailValidation = require('../models').EmailValidation;
const EmailValidationService = require('./EmailValidationService');
const queue = require('../common/queue');
const logger = require('../common/logger');

const ONE_HOUR = 60 * 60 * 1000;

const findEmail = (email) => {
	return EmailValidation.findOne({ where: { email }});
};

const deleteEmail = (email) => {
	return EmailValidation.destroy({ where: { email }});
};

const validateEmailAsync = async (email) => {
	const [emailValidation, created] = await EmailValidation.findOrCreate({
		where: { email },
		defaults: { email, isValid: false }
	});

	let correlationId = emailValidation.jobId;

	if (created || (new Date() - emailValidation.updatedAt) > ONE_HOUR) {
		logger.info('Creating job', { jobId: correlationId });
		correlationId = parseInt(Math.random() * 1000).toString();
		const resp = await queue.sendMessage({ email }, { correlationId });

		await emailValidation.update({ jobId: correlationId, });
	}

	return emailValidation;
};

const validateEmail = async (email, options = {}) => {
	const validationResults = await EmailValidationService.checkEmailValidity(email);

	if (options.shouldSave) {
		const emailProperties = {
			isValid: validationResults.isValid,
			confidence: validationResults.confidence,
			isProcessed: true
		};

		await EmailValidation.update(emailProperties, { where: { email } })
	}

	return validationResults;
};

module.exports = {
	findEmail,
	deleteEmail,
	validateEmailAsync,
	validateEmail,
};
