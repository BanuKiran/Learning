import { Application, Router } from 'express';
import { changePassword } from './changePasswordHelper';

export function register(app: Application | Router) {
	/**
	 * @swagger
	 * /admin/change-password:
	 *  post:
	 *    summary: Sets new password for currently logged in admin
	 *    tags:
	 *      - Users
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#components/schemas/ChangePasswordDto'
	 *    responses:
	 *      204:
	 *        description: Password is changed
	 *      400:
	 *        description: Validation error
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#components/schemas/HttpError'
	 *      401:
	 *        description:
	 *          User is unauthorized or not superadmin
	 */
	app.post('/change-password', changePassword);
}
