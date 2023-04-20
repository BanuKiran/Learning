import { HttpError } from './errors';

export const validationErrorKey = 'VALIDATION_ERROR';

/**
 * @swagger
 * components:
 *   schemas:
 *     ValidationErrorDto:
 *       type: object
 *       description: Validation error data
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
 *         globalErrors:
 *           type: array
 *           description: Form global errors array
 *           items:
 *             $ref: '#/components/schemas/GlobalErrorDto'
 *         fieldErrors:
 *           type: array
 *           description: Form field errors array
 *           items:
 *             $ref: '#/components/schemas/FieldErrorDto'
 */
export class ValidationErrorDto extends HttpError {
	public globalErrors?: GlobalErrorDto[];
	public fieldErrors?: FieldErrorDto[];

	constructor(globalErrors?: GlobalErrorDto[], fieldErrors?: FieldErrorDto[]) {
		super({
			key: validationErrorKey,
			status: 400,
			message: 'Validation error'
		});
		this.globalErrors = globalErrors;
		this.fieldErrors = fieldErrors;
	}
}

/**
 * @swagger
 * components:
 *  schemas:
 *    GlobalErrorDto:
 *      type: object
 *      description: Global validation error data
 *      properties:
 *        message:
 *          type: string
 *          description: Error message
 *        parameters:
 *          type: array
 *          description: Localization parameters
 *          items:
 *           type: string
 */
export interface GlobalErrorDto {
	message: string;
	parameters?: string[];
}

/**
 * @swagger
 * components:
 *  schemas:
 *    FieldErrorDto:
 *      type: object
 *      description: Global validation error data
 *      properties:
 *        field:
 *          type: string
 *          description: Error field
 *        message:
 *          type: string
 *          description: Error message
 *        parameters:
 *          type: array
 *          description: Localization parameters
 *          items:
 *           type: string
 */
export interface FieldErrorDto extends GlobalErrorDto {
	field: string;
}
