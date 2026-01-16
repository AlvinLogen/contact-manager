const { ValidatorError } = require('../middleware/errorHandler');
const { validateContact, validateId } = require('../middleware/validator');

describe('Validation Middleware', () => {
    describe('validateContact', () => {
        let req, res, next;

        beforeEach(() => {
            req = { body: {}};
            res = {};
            next = jest.fn();
        });

        test('should pass validation with valid data', () => {
            req.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '1234567890'
            };

            validateContact(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        test('Should fail when email format is invalid', () => {
            req.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'invalid-email'
            }

            expect(() => validateContact(req, res, next)).toThrow(ValidatorError);
        });
    });

    describe('validateId', () => {
        let req, res, next;

        beforeEach(() => {
            req = { params: {} };
            res = {};
            next = jest.fn();
        });

        test('Should fail when ID is not a number', () => {
            req.params.id = '5';

            validateId(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(req.params.id).toBe(5);
        });

        test('Should fail when ID is negative', () => {
            req.params.id = '-1';

            expect(() => validateId(req, res, next)).toThrow(ValidatorError);
        });
    });
});