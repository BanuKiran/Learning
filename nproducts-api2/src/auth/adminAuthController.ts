import { Application, Request, Response, NextFunction, Router } from 'express';
import authService from './authService';
import { LoginDto } from './loginDto';
import { getAdminRoles } from '../models/user';
import { authGuard } from './authGuard';
import { LoginTarget } from './loginTarget';

export const register = (app: Application | Router) => {
	/**
	 * @swagger
	 * /admin/login:
	 *  post:
	 *    summary: Login with username and password
	 *    tags:
	 *      - Auth
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#/components/schemas/LoginDto'
	 *    responses:
	 *      200:
	 *        description: User is logged in
	 *        content:
	 *          applcation/json:
	 *            schema:
	 *              $ref: '#/components/schemas/LoginResultDto'
	 *      401:
	 *        description: Bad credentials, login failed
	 */
	app.post('/login', (req: Request, res: Response, next: NextFunction) => {
		const dto: LoginDto = req.body;
		authService
			.login(dto.username, dto.password, LoginTarget.ADMIN, res, ...getAdminRoles())
			.then(response => {
				if (response) {
					res.status(200).json(response);
				} else {
					res.status(401).send();
				}
			})
			.catch(next);
	});

	/**
	 * @swagger
	 * /admin/logout:
	 *  post:
	 *    summary: Logs out the user
	 *    tags:
	 *      - Auth
	 *    responses:
	 *      204:
	 *        description: User is logged out
	 */
	app.post(
		'/logout',
		authGuard(LoginTarget.ADMIN, ...getAdminRoles()),
		(req: Request, res: Response, next: NextFunction) => {
			authService
				.logout(res.locals.currentUser)
				.then(() => {
					res.clearCookie(`${process.env.AUTH_TOKEN_COOKIE || 'AuthSu'}_${LoginTarget.ADMIN}`);
					res.status(204).send();
				})
				.catch(next);
		}
	);
};
