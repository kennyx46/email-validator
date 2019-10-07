const EmailService = require('../../services/EmailService');
const EmailValidation = require('../../models').EmailValidation;


jest.mock('../../services/EmailValidationService', () => ({
    checkEmailValidity: jest.fn(() => ({ }))
}));
const { checkEmailValidity } = require('../../services/EmailValidationService');

jest.mock('../../common/queue', () => ({
    sendMessage: jest.fn(() => ({ }))
}));
const { sendMessage } = require('../../common/queue');

describe('EmailService', () => {

    afterEach(() => {
        jest.resetAllMocks();
    });


    it('finds email', async () => {
        EmailValidation.findOne = jest.fn();
        const testEmail = "bla@bla.com";

        const result = await EmailService.findEmail(testEmail);

        expect(EmailValidation.findOne).toHaveBeenCalled();
    });

    it('validates email', async () => {
        const testEmail = "bla@bla.com";

        const result = await EmailService.validateEmail(testEmail);

        expect(checkEmailValidity).toHaveBeenCalled();
    });

    it('validates email async', async () => {
        const emailValidationInstanceMock = { update: jest.fn() };
        EmailValidation.findOrCreate = jest.fn(() => [emailValidationInstanceMock, true]);

        const testEmail = "bla@bla.com";

        const result = await EmailService.validateEmailAsync(testEmail);

        expect(EmailValidation.findOrCreate).toHaveBeenCalled();
        expect(sendMessage).toHaveBeenCalled();
        expect(emailValidationInstanceMock.update).toHaveBeenCalled();
    });


});
