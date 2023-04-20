import { Application, Router } from 'express';
import { changePassword } from './changePasswordHelper';
import { rolesGuard } from '../auth/rolesGuard';
import { UserRole } from '../models/user';

export function register(app: Application | Router) {
	/**
	 * @swagger
	 * /client/change-password:
	 *  post:
	 *    summary: Sets new password for currently logged in non admin user
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
	app.post('/change-password', rolesGuard(UserRole.USER), changePassword);
}
