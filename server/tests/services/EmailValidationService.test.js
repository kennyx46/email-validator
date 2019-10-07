const EmailValidationService = require('../../services/EmailValidationService');

const mockTelnetSend = jest.fn();
jest.mock('telnet-client', () => {
    return function() {
        return {
            connect: jest.fn(),
            send: mockTelnetSend,
            end: jest.fn()
        };
    };
});

jest.mock('../../utils/nslookup', () => jest.fn());
const nslookup = require('../../utils/nslookup');

jest.mock('../../utils/validators', () => ({
    isValidEmail: jest.fn(() => true)
}));
const { isValidEmail } = require('../../utils/validators');


describe('EmailValidationService', () => {

    afterEach(() => {
        jest.resetAllMocks();
    });


    it('checks reg exp', async () => {
        isValidEmail.mockImplementation(() => false);
        const testEmail = "bla@bla.com";
        const expectedResult = { isValid: false, confidence: 1 };

        const result = await EmailValidationService.checkEmailValidity(testEmail);

        expect(isValidEmail).toHaveBeenCalled();
        expect(result).toEqual(expectedResult);
    });

    it('checks nslookup', async () => {
        isValidEmail.mockImplementation(() => true);
        nslookup.mockImplementation(() => []);

        const testEmail = "bla@bla.com";
        const expectedResult = { isValid: false, confidence: 1 };

        const result = await EmailValidationService.checkEmailValidity(testEmail);

        expect(nslookup).toHaveBeenCalled();
        expect(result).toEqual(expectedResult);
    });

    it('sends initial telnet request', async () => {
        isValidEmail.mockImplementation(() => true);
        nslookup.mockImplementation(() => ['example.com']);
        mockTelnetSend.mockImplementation(() => "550");

        const testEmail = "bla@bla.com";
        const expectedResult = { isValid: false, confidence: 0.66 };

        const result = await EmailValidationService.checkEmailValidity(testEmail);

        expect(result).toEqual(expectedResult);
    });

    it('sends all telnet requests and receives "user not exist"', async () => {
        isValidEmail.mockImplementation(() => true);
        nslookup.mockImplementation(() => ['example.com']);
        mockTelnetSend
            .mockImplementationOnce(() => "250")
            .mockImplementationOnce(() => "250")
            .mockImplementationOnce(() => "550");

        const testEmail = "bla@bla.com";
        const expectedResult = { isValid: false, confidence: 1 };

        const result = await EmailValidationService.checkEmailValidity(testEmail);

        expect(result).toEqual(expectedResult);
    });

    it('sends all telnet requests and received succesfull results', async () => {
        isValidEmail.mockImplementation(() => true);
        nslookup.mockImplementation(() => ['example.com']);
        mockTelnetSend.mockImplementation(() => "250");

        const testEmail = "bla@bla.com";
        const expectedResult = { isValid: true, confidence: 1 };

        const result = await EmailValidationService.checkEmailValidity(testEmail);

        expect(result).toEqual(expectedResult);
    });

});
