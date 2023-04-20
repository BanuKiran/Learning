import { ChangeOtherUserPasswordDto } from './changeOtherUserPasswordDto';
import { ValidationErrors } from '../utils/validationErrors';
import { ValidatorUtils } from '../utils/validatorUtils';

class PasswordValidator {
	public validate(dto: ChangeOtherUserPasswordDto, field: string = 'password') {
		const errors = new ValidationErrors();

		ValidatorUtils.validateRequiredAndNotBlank(dto.password, field, errors);
		ValidatorUtils.validatePassword(dto.password, field, errors);

		errors.throwIfHasErrors();
	}
}

const passwordValidator = new PasswordValidator();
export default passwordValidator;
