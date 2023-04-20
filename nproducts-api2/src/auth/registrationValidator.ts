import { RegistrationDto } from './registrationDto';
import * as emailValidator from 'email-validator';
import { ValidatorUtils } from '../utils/validatorUtils';
import { ValidationErrors } from '../utils/validationErrors';

class RegistrationValidator {
	public async validate(dto: RegistrationDto, userId?: number) {
		const errors = new ValidationErrors();

		ValidatorUtils.validateRequiredAndNotBlank(dto.email, 'email', errors);
		if (!errors.hasFieldErrors('email') && !emailValidator.validate(dto.email)) {
			errors.addFieldError({
				field: 'email',
				message: 'Invalid email'
			});
		}
		await ValidatorUtils.validateUniqueUserEmail(dto.email, 'email', errors, userId);

		ValidatorUtils.validateRequired(dto.password, 'password', errors);
		ValidatorUtils.validatePassword(dto.password, 'password', errors);

		errors.throwIfHasErrors();
	}
}

const registrationValidator = new RegistrationValidator();
export default registrationValidator;
