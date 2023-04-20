import { ValidationErrors } from '../utils/validationErrors';
import { EditAdminUserDto } from './editAdminUserDto';
import { ValidatorUtils } from '../utils/validatorUtils';
import { UserRole, getAdminRoles } from '../models/user';

class EditAdminUserValidator {
	public validate(dto: EditAdminUserDto) {
		const errors = new ValidationErrors();

		ValidatorUtils.validateRequiredAndNotBlank(dto.role, 'role', errors);
		ValidatorUtils.validateRequiredAndNotBlank(dto.firstName, 'firstName', errors);
		ValidatorUtils.validateRequiredAndNotBlank(dto.lastName, 'lastName', errors);
		ValidatorUtils.validateEnumValue(dto.role, UserRole, 'role', errors);
		if (!errors.hasFieldErrors('role') && !getAdminRoles().includes(dto.role)) {
			errors.addFieldError({
				field: 'role',
				message: 'Not an admin role'
			});
		}

		errors.throwIfHasErrors();
	}
}

const editAdminUserValidator = new EditAdminUserValidator();
export default editAdminUserValidator;
