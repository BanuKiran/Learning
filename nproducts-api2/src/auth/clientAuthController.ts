import { Application, Request, Response, NextFunction, Router } from 'express';
import authService from './authService';
import { LoginDto } from './loginDto';
import { getClientRoles, UserRole } from '../models/user';
import { authGuard } from './authGuard';
import utilsService from '../utils/utilsService';
import { RegistrationDto } from './registrationDto';
import { AdminLoginDto } from './adminLoginDto';
import { SwitchDto } from './switchDto';
import { UsersListResultDto } from './usersListResultDto';
import { LoginTarget } from './loginTarget';
import { Errors, HttpError } from '../utils/errors';

export const register = (app: Application | Router) => {
	/**
	 * @swagger
	 * /client/login:
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
			.login(dto.username, dto.password, LoginTarget.CLIENT, res, ...getClientRoles())
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
	 * /client/admin-login:
	 *  post:
	 *    summary: Login with admin username and password to a client account
	 *    tags:
	 *      - Auth
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#/components/schemas/AdminLoginDto'
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
	app.post('/admin-login', (req: Request, res: Response, next: NextFunction) => {
		const dto: AdminLoginDto = req.body;
		authService
			.adminLogin(dto.adminUsername, dto.clientUsername, dto.password, dto.userId, LoginTarget.CLIENT, res)
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
	 * /client/logout:
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
		authGuard(LoginTarget.CLIENT, ...getClientRoles()),
		(req: Request, res: Response, next: NextFunction) => {
			authService
				.logout(res.locals.currentUser, res.locals.currentAdminUser)
				.then(() => {
					res.clearCookie(`${process.env.AUTH_TOKEN_COOKIE || 'AuthSu'}_${LoginTarget.CLIENT}`);
					res.status(204).send();
				})
				.catch(next);
		}
	);

	/**
	 * @swagger
	 * /client/register-anon:
	 *  post:
	 *    summary: Registers an anonymous user
	 *    tags:
	 *      - Auth
	 *    responses:
	 *      200:
	 *        description: Anonymous user is registered
	 *        content:
	 *          applcation/json:
	 *            schema:
	 *              $ref: '#/components/schemas/LoginResultDto'
	 */
	app.post('/register-anon', (req: Request, res: Response, next: NextFunction) => {
		authService
			.registerAnon(res)
			.then(result => {
				res.status(200).json(result);
			})
			.catch(next);
	});

	/**
	 * @swagger
	 * /client/register:
	 *  post:
	 *    summary:
	 *      Registers a regular user.
	 *      If an anonymous user is currenyly logged in
	 *      it makes that user permanent
	 *      instead of creating a new user.
	 *    tags:
	 *      - Auth
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#/components/schemas/RegistrationDto'
	 *    responses:
	 *      200:
	 *        description: User is registered
	 *        content:
	 *          applcation/json:
	 *            schema:
	 *              $ref: '#/components/schemas/LoginResultDto'
	 *      400:
	 *        description: Validation error
	 *        content:
	 *          applcation/json:
	 *            schema:
	 *              $ref: '#/components/schemas/ValidationErrorDto'
	 */
	app.post('/register', async (req: Request, res: Response, next: NextFunction) => {
		const entry = await utilsService.getCurrentLoginEntry(req, LoginTarget.CLIENT);
		const dto: RegistrationDto = req.body;
		const promise =
			entry && entry.user.role === UserRole.ANON
				? authService.makeUserPermanent(dto, entry.user)
				: authService.registerNewUser(dto, res);

		promise
			.then(result => {
				res.status(200).send(result);
			})
			.catch(next);
	});
	/**
	 * @swagger
	 * /client/create-subuser:
	 *  post:
	 *    summary:
	 *      Creates sub user for given user.
	 *    tags:
	 *      - Auth
	 *    responses:
	 *      200:
	 *        description: List of users with relation in current User
	 *        content:
	 *          applcation/json:
	 *            schema:
	 *              $ref: '#/components/schemas/UsersListResultDto'
	 *      400:
	 *        description: User Limit is exceeded
	 */
	app.post(
		'/create-subuser',
		authGuard(LoginTarget.CLIENT, ...getClientRoles()),
		async (req: Request, res: Response, next: NextFunction) => {
			authService
				.registerSubUser(res.locals.currentUser, next)
				.then(resp => {
					res.status(200).send(resp);
				})
				.catch(next);
		}
	);
	/**
	 * @swagger
	 * /client/switch-user:
	 *  post:
	 *    summary:
	 *      Switches session to given User.
	 *    tags:
	 *      - Auth
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#/components/schemas/SwitchDto'
	 *    responses:
	 *      200:
	 *        description: User is logged in
	 *        content:
	 *          applcation/json:
	 *            schema:
	 *              $ref: '#/components/schemas/LoginResultDto'
	 *      400:
	 *        description: Error
	 */
	app.post(
		'/switch-user',
		authGuard(LoginTarget.CLIENT, ...getClientRoles()),
		async (req: Request, res: Response, next: NextFunction) => {
			const dto: SwitchDto = req.body;
			const oldUser = res.locals.currentUser;
			const adminUser = res.locals.currentAdminUser;
			res.clearCookie(`${process.env.AUTH_TOKEN_COOKIE || 'AuthSu'}_${LoginTarget.CLIENT}`);
			const user = await authService.switchUser(
				dto.targetUserId,
				oldUser.id,
				adminUser,
				LoginTarget.CLIENT,
				res,
				...getClientRoles()
			);
			await authService.logout(oldUser, adminUser);
			if (user) {
				res.status(200).json(user);
			} else {
				res.status(401).send();
			}
		}
	);
	/**
	 * @swagger
	 * /client/users-list:
	 *  get:
	 *    summary:
	 *      Get List of users with relation in current User
	 *    tags:
	 *      - Auth
	 *    responses:
	 *      200:
	 *        description: List of users with relation in current User
	 *        content:
	 *          applcation/json:
	 *            schema:
	 *              $ref: '#/components/schemas/UsersListResultDto'
	 *      400:
	 *        description: Error
	 */
	app.get(
		'/users-list',
		authGuard(LoginTarget.CLIENT, ...getClientRoles()),
		async (req: Request, res: Response, next: NextFunction) => {
			authService
				.getUsersTree(res.locals.currentUser)
				.then(resp => {
					res.status(200).send(resp);
				})
				.catch(next);
		}
	);
};
