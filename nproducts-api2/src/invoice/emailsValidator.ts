import { EmailDto } from './invoiceDto';
import * as emailValidator from 'email-validator';
import { ValidationErrors } from '../utils/validationErrors';
import { ValidatorUtils } from '../utils/validatorUtils';
import { User, UserRole } from '../models/user';

class EmailsValidator {
	public async validate(dto: EmailDto, user: User) {
		const errors = new ValidationErrors();

		ValidatorUtils.validateRequiredAndNotBlank(dto.email, 'email', errors);
		if (!errors.hasFieldErrors('email') && !emailValidator.validate(dto.email)) {
			errors.addFieldError({
				field: 'email',
				message: 'Invalid email'
			});
		}
		if (dto.forMailingList && user.email !== dto.email) {
			await ValidatorUtils.validateUniqueEmailInEmails(dto.email, 'email', errors);
		}
		if (user.role === UserRole.ANON && user.email !== dto.email) {
			await ValidatorUtils.validateUniqueUserEmail(dto.email, 'email', errors);
		}

		errors.throwIfHasErrors();
	}
}

const emailsValidator = new EmailsValidator();
export default emailsValidator;
