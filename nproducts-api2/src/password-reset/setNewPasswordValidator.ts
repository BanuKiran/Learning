import { SetNewPasswordDto } from './setNewPasswordDto';
import { ValidationErrors } from '../utils/validationErrors';
import { ValidatorUtils } from '../utils/validatorUtils';

class SetNewPasswordValidator {
	public validate(dto: SetNewPasswordDto) {
		const errors = new ValidationErrors();

		ValidatorUtils.validateRequired(dto.newPassword, 'newPassword', errors);
		ValidatorUtils.validatePassword(dto.newPassword, 'newPassword', errors);

		errors.throwIfHasErrors();
	}
}

const setNewPasswordValidator = new SetNewPasswordValidator();
export default setNewPasswordValidator;
