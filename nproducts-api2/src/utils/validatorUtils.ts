import * as _ from 'lodash';
import { ValidationErrors } from './validationErrors';
import { User } from '../models/user';
import { Email } from '../models/email';

export class ValidatorUtils {
	private static readonly MIN_MATCHING_GROUPS = 3;
	private static readonly LOWER_CASE_PATTERN = /[a-z]+/;
	private static readonly UPPER_CASE_PATTERN = /[A-Z]+/;
	private static readonly DIGITS_PATTERN = /[0-9]/;
	private static readonly SPECIAL_PATTERN = /\W|_/;

	public static validateRequired(value: string, field: string, errors: ValidationErrors) {
		if (errors.hasFieldErrors(field)) {
			return;
		}
		if (!value) {
			errors.addFieldError({
				field: field,
				message: 'Required'
			});
		}
	}

	public static validateNotBlank(value: string, field: string, errors: ValidationErrors) {
		if (errors.hasFieldErrors(field)) {
			return;
		}
		if (!_.trim(value)) {
			errors.addFieldError({
				field: field,
				message: 'Not blank'
			});
		}
	}

	public static validateRequiredAndNotBlank(value: string, field: string, errors: ValidationErrors) {
		ValidatorUtils.validateRequired(value, field, errors);
		ValidatorUtils.validateNotBlank(value, field, errors);
	}

	public static validateMaxLength(value: string, field: string, maxLength: number, errors: ValidationErrors) {
		if (errors.hasFieldErrors(field) || !value) {
			return;
		}
		if (value.length > maxLength) {
			errors.addFieldError({
				field: field,
				message: 'Text is too long',
				parameters: [maxLength.toString()]
			});
		}
	}

	public static validatePassword(password: string, field: string, errors: ValidationErrors) {
		if (!password || errors.hasFieldErrors(field)) {
			return;
		}

		const complexityError = {
			field: field,
			message: 'Password too weak'
		};

		if (password.length < 4) {
			errors.addFieldError(complexityError);
		} else {
			let matches = 0;
			if (this.LOWER_CASE_PATTERN.test(password)) {
				matches++;
			}
			if (this.UPPER_CASE_PATTERN.test(password)) {
				matches++;
			}
			if (this.DIGITS_PATTERN.test(password)) {
				matches++;
			}
			if (this.SPECIAL_PATTERN.test(password)) {
				matches++;
			}
			if (matches < this.MIN_MATCHING_GROUPS) {
				errors.addFieldError(complexityError);
			}
		}
	}

	public static async validateUniqueUserEmail(email: string, field: string, errors: ValidationErrors, userId?: number) {
		if (!email || errors.hasFieldErrors(field)) {
			return;
		}

		const query = User.query().whereRaw('LOWER(email) = ?', email.toLowerCase());
		if (userId) {
			query.andWhere('id', '!=', userId);
		}
		if ((await query).length > 0) {
			errors.addFieldError({
				field: field,
				message: 'Email is not unique'
			});
		}
	}

	public static async validateUniqueEmailInEmails(email: string, field: string, errors: ValidationErrors) {
		if (!email || errors.hasFieldErrors(field)) {
			return;
		}

		if ((await Email.query().whereRaw('LOWER(email) = ?', email.toLowerCase())).length > 0) {
			errors.addFieldError({
				field: field,
				message: 'Email is not unique'
			});
		}
	}

	public static validateEnumValue(value: unknown, enumObject: object, field: string, errors: ValidationErrors) {
		if (!value || errors.hasFieldErrors(field)) {
			return;
		}

		if (!Object.values(enumObject).includes(value)) {
			errors.addFieldError({
				field: field,
				message: 'Incorrect enum value'
			});
		}
	}

	public static validateNumber(value: number, field: string, errors: ValidationErrors) {
		if (typeof value !== 'number') {
			errors.addFieldError({
				field: field,
				message: 'Value is not a number'
			});
		}
	}

	public static validateNumberMinValue(value: number, field: string, min: number, errors: ValidationErrors) {
		if (value < min) {
			errors.addFieldError({
				field: field,
				message: `Value must be at least ${min}`
			});
		}
	}

	public static validateNumberMaxValue(value: number, field: string, max: number, errors: ValidationErrors) {
		if (value > max) {
			errors.addFieldError({
				field: field,
				message: `Value must be at most ${max}`
			});
		}
	}

	public static validateNumberInRange(
		value: number,
		field: string,
		min: number,
		max: number,
		errors: ValidationErrors
	) {
		ValidatorUtils.validateNumber(value, field, errors);
		ValidatorUtils.validateNumberMinValue(value, field, min, errors);
		ValidatorUtils.validateNumberMaxValue(value, field, max, errors);
	}
}
