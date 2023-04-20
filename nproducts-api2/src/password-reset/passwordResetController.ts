import { Application, Router, Request, Response, NextFunction } from 'express';
import { PasswordResetDto } from './passwordResetDto';
import passwordResetService from './passwordResetService';
import { SetNewPasswordDto } from './setNewPasswordDto';
import { validationErrorKey } from '../utils/validationErrorDto';

export function register(app: Application | Router) {
	/**
	 * @swagger
	 * /client/password/reset:
	 *  post:
	 *    summary: Starts password reset process for the specified email address
	 *    tags:
	 *      - Password reset
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#components/schemas/PasswordResetDto'
	 *    responses:
	 *      204:
	 *        description: An email with password reset instructions is sent
	 *      400:
	 *        description: Validation error
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#components/schemas/ValidationErrorDto'
	 */
	/**
	 * @swagger
	 * /admin/password/reset:
	 *  post:
	 *    summary: Starts password reset process for the specified email address
	 *    tags:
	 *      - Password reset
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#components/schemas/PasswordResetDto'
	 *    responses:
	 *      204:
	 *        description: An email with password reset instructions is sent
	 *      400:
	 *        description: Validation error
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#components/schemas/ValidationErrorDto'
	 */
	app.post('/password/reset', (req: Request, res: Response, next: NextFunction) => {
		const dto: PasswordResetDto = req.body;
		passwordResetService
			.resetPassword(dto)
			.then(() => {
				res.status(204).send();
			})
			.catch(next);
	});

	/**
	 * @swagger
	 * /client/password/set-new:
	 *  post:
	 *    summary: Sets new password
	 *    tags:
	 *      - Password reset
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#components/schemas/SetNewPasswordDto'
	 *    responses:
	 *      204:
	 *        description: Password is reset
	 *      404:
	 *        description: Password reset token was not found
	 *      400:
	 *        description: Validation error
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#components/schemas/ValidationErrorDto'
	 */
	/**
	 * @swagger
	 * /admin/password/set-new:
	 *  post:
	 *    summary: Sets new password
	 *    tags:
	 *      - Password reset
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#components/schemas/SetNewPasswordDto'
	 *    responses:
	 *      204:
	 *        description: Password is reset
	 *      404:
	 *        description: Password reset token was not found
	 *      400:
	 *        description: Validation error
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#components/schemas/ValidationErrorDto'
	 */
	app.post('/password/set-new', (req: Request, res: Response, next: NextFunction) => {
		const dto: SetNewPasswordDto = req.body;
		passwordResetService
			.setNewPassword(dto)
			.then(() => {
				res.status(204).send();
			})
			.catch(error => {
				if (error.key === validationErrorKey) {
					next(error);
				} else {
					res.status(404).send();
				}
			});
	});
}
