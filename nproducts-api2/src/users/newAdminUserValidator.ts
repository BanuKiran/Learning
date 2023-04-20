import { ValidationErrors } from '../utils/validationErrors';
import { CreateNewAdminUserDto } from './createNewAdminUserDto';
import { ValidatorUtils } from '../utils/validatorUtils';
import { UserRole, getAdminRoles } from '../models/user';

class NewAdminUserValidator {
	public async validate(dto: CreateNewAdminUserDto) {
		const errors = new ValidationErrors();

		ValidatorUtils.validateRequiredAndNotBlank(dto.email, 'email', errors);
		ValidatorUtils.validateRequiredAndNotBlank(dto.password, 'password', errors);
		ValidatorUtils.validateRequiredAndNotBlank(dto.role, 'role', errors);
		ValidatorUtils.validateRequiredAndNotBlank(dto.firstName, 'firstName', errors);
		ValidatorUtils.validateRequiredAndNotBlank(dto.lastName, 'lastName', errors);
		await ValidatorUtils.validateUniqueUserEmail(dto.email, 'email', errors);
		ValidatorUtils.validatePassword(dto.password, 'password', errors);
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

const newAdminUserValidator = new NewAdminUserValidator();
export default newAdminUserValidator;
