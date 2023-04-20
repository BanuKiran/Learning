import { ValidationError } from 'objection';
import { Request, Response, NextFunction } from 'express';
import { GlobalErrorDto, FieldErrorDto } from './validationErrorDto';

export interface ErrorDetails {
	key: string;
	status: number;
	message: string;
}

export class Errors {
	public static readonly NOT_FOUND: ErrorDetails = {
		key: 'NOT_FOUND',
		status: 404,
		message: 'Not found'
	};
	public static readonly EMAIL_ALREADY_EXIST: ErrorDetails = {
		key: 'EMAIL_ALREADY_EXIST',
		status: 400,
		message: 'Email already exists'
	};
	public static readonly ABSENCE_OVERLAPPING: ErrorDetails = {
		key: 'ABSENCE_OVERLAPPING',
		status: 400,
		message: "Cannot add the absence - it's date overlaps with another one"
	};
	public static readonly INVALID_DATE: ErrorDetails = {
		key: 'INVALID_DATE',
		status: 400,
		message: 'Date is invalid'
	};
	public static readonly FIELD_REQUIRED: ErrorDetails = {
		key: 'FIELD_REQUIRED',
		status: 400,
		message: 'Field is required'
	};
	public static readonly EMAIL_TEMPLATE_ERROR: ErrorDetails = {
		key: 'EMAIL_TEMPLATE_ERROR',
		status: 500,
		message: 'Email template error'
	};
	public static readonly RECIPIENTS_LIST_EMPTY: ErrorDetails = {
		key: 'RECIPIENTS_LIST_EMPTY',
		status: 500,
		message: 'Cannot send an email because the recipients list is empty'
	};
	public static readonly NOT_A_NUMBER: ErrorDetails = {
		key: 'NOT_A_NUMBER',
		status: 400,
		message: 'Numerical input is not a number'
	};
	public static readonly INCORRECT_PASSWORD: ErrorDetails = {
		key: 'INCORRECT_PASSWORD',
		status: 400,
		message: 'Incorrect password'
	};
	public static readonly INVALID_DATA: ErrorDetails = {
		key: 'INVALID_DATA',
		status: 400,
		message: 'Invalid data'
	};
	public static readonly FILE_TOO_BIG: ErrorDetails = {
		key: 'FILE_TOO_BIG',
		status: 400,
		message: 'Uploaded file is too big'
	};
	public static readonly NO_FILE: ErrorDetails = {
		key: 'NO_FILE',
		status: 400,
		message: 'No file was sent'
	};
	public static readonly INVALID_FILE: ErrorDetails = {
		key: 'INVALID_FILE',
		status: 400,
		message: 'file is invalid'
	};
	public static readonly TOO_MANY_TEMPLATES: ErrorDetails = {
		key: 'TOO_MANY_TEMPLATES',
		status: 400,
		message: 'There are too many templates'
	};
	public static readonly HAS_EXISTING_DATA: ErrorDetails = {
		key: 'HAS_EXISTING_DATA',
		status: 400,
		message: 'Record still has data associated with it'
	};
	public static readonly ALREADY_PAID: ErrorDetails = {
		key: 'ALREADY_PAID',
		status: 400,
		message: 'Questionnaire already paid'
	};
	public static readonly NOT_PAID: ErrorDetails = {
		key: 'NOT_PAID',
		status: 400,
		message: 'Payment not finished yet'
	};
	public static readonly PAYMENT_ERROR: ErrorDetails = {
		key: 'PAYMENT_ERROR',
		status: 500,
		message: 'Something went wrong'
	};
	public static readonly EMAIL_NOT_FOUND_ERROR: ErrorDetails = {
		key: 'EMAIL_NOT_FOUND_ERROR',
		status: 404,
		message: 'E-mail address not found in billing details'
	};
	public static readonly LIMIT_EXCEEDED: ErrorDetails = {
		key: 'LIMIT_EXCEEDED',
		status: 400,
		message: 'Questionaire Limit Exceeded'
	};
	public static readonly CONFIG_ERROR: ErrorDetails = {
		key: 'CONFIG_ERROR',
		status: 500,
		message: 'Something went wrong'
	};
}

/**
 * @swagger
 * components:
 *   schemas:
 *     HttpError:
 *       type: object
 *       description: Error data
 *       properties:
 *         key:
 *           type: string
 *           description:
 *             Error key for error message translation on the frontend
 *         status:
 *           type: number
 *           description:
 *             Http error code
 *         message:
 *           type: string
 *           description:
 *             Human readable error message
 */
export class HttpError extends Error {
	public status!: number;
	public key!: string;

	constructor(details: ErrorDetails, status?: number, message?: string) {
		super(message || details.message || 'Unknown error');
		this.name = this.constructor.name;
		this.key = details.key;
		this.status = details.status || status || 500;
	}
}

export function errorHandler(
	error: {
		message: string;
		status?: number;
		statusCode?: number;
		key?: string;
		globalErrors?: GlobalErrorDto[];
		fieldErrors?: FieldErrorDto[];
	},
	req: Request,
	res: Response,
	next: NextFunction
) {
	const message = error.message;
	const status = error.status || error.statusCode || 500;
	const validationData: unknown = error instanceof ValidationError ? error.data : undefined;
	const key = error.key || undefined;
	const errorJson = {
		status: status,
		message: message,
		key: key,
		validationErrors: validationData,
		globalErrors: error.globalErrors,
		fieldErrors: error.fieldErrors
	};
	console.log(`${error.constructor.name}: ${JSON.stringify(errorJson)}`);

	res.status(status).json(errorJson);
}
