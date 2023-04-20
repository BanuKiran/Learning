import { Application, Request, Response, NextFunction, Router } from 'express';
import usersService from './usersService';
import { CreateNewAdminUserDto } from './createNewAdminUserDto';
import { rolesGuard } from '../auth/rolesGuard';
import { UserRole } from '../models/user';
import { ChangeOtherUserPasswordDto } from './changeOtherUserPasswordDto';
import { FiltersDto } from '../utils/filtersDto';
import { EditAdminUserDto } from './editAdminUserDto';

export function register(app: Application | Router) {
	/**
	 * @swagger
	 * /admin/users:
	 *  get:
	 *    summary: Returns a paginated list of all admin users
	 *    tags:
	 *      - Users
	 *    parameters:
	 *      - in: query
	 *        name: page
	 *        type: number
	 *        description: Requested page (0 indexed)
	 *      - in: query
	 *        name: size
	 *        type: number
	 *        description: Size if a single page
	 *      - in: query
	 *        name: sort
	 *        type: string
	 *        description: Comma (,) separated sort expressions (column,order)
	 *    responses:
	 *      200:
	 *        description: Content for the requested page is returned
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              description: PageDto with pagination data
	 *              properties:
	 *                content:
	 *                  type: array
	 *                  description: Page rows
	 *                  items:
	 *                    $ref: '#/components/schemas/UserOnListDto'
	 *                first:
	 *                  type: boolean
	 *                  description: True if first page is returned
	 *                last:
	 *                  type: boolean
	 *                  description: True if last page is returned
	 *                number:
	 *                  type: number
	 *                  description: Page number
	 *                numberOfElements:
	 *                  type: number
	 *                  description: Number of returned rows
	 *                size:
	 *                  type: number
	 *                  description: Page size
	 *                totalElements:
	 *                  type: number
	 *                  description: Total number of all rows
	 *                totalPages:
	 *                  type: number
	 *                  description: Total number of pages
	 *                sort:
	 *                  type: array
	 *                  items:
	 *                    $ref: '#/components/schemas/Sort'
	 *      401:
	 *        description:
	 *          User is unauthorized or not admin
	 */
	app.get('/users', (req: Request, res: Response, next: NextFunction) => {
		const filters = FiltersDto.fromRequest(req);
		usersService
			.getUsersList(filters)
			.then(users => res.status(200).send(users))
			.catch(next);
	});

	/**
	 * @swagger
	 * /admin/user:
	 *  post:
	 *    summary: Creates new admin user
	 *    tags:
	 *      - Users
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#components/schemas/CreateNewAdminUserDto'
	 *    responses:
	 *      200:
	 *        description: New admin data is returned
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: array
	 *              items:
	 *                $ref: '#/components/schemas/AdminUserDto'
	 *      401:
	 *        description:
	 *          User is unauthorized or not admin
	 */
	app.post('/user', rolesGuard(UserRole.ADMIN), (req: Request, res: Response, next: NextFunction) => {
		const dto: CreateNewAdminUserDto = req.body;
		usersService
			.createNewAdminUser(dto)
			.then(user => res.status(200).send(user))
			.catch(next);
	});

	/**
	 * @swagger
	 * /admin/user/{id}:
	 *  put:
	 *    summary: Edits the user
	 *    tags:
	 *      - Users
	 *    parameters:
	 *      - in: path
	 *        name: id
	 *        required: true
	 *        schema:
	 *          type: number
	 *          description:
	 *            Id of the user
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#components/schemas/EditAdminUserDto'
	 *    responses:
	 *      200:
	 *        description: User is edited and returned
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
	app.put('/user/:id', rolesGuard(UserRole.ADMIN), (req: Request, res: Response, next: NextFunction) => {
		const id = Number(req.params.id);
		const dto: EditAdminUserDto = req.body;

		usersService
			.editAdminUser(id, dto)
			.then(user => res.status(200).send(user))
			.catch(next);
	});

	/**
	 * @swagger
	 * /admin/user/{id}/change-password:
	 *  put:
	 *    summary: Sets new password for another user
	 *    tags:
	 *      - Users
	 *    parameters:
	 *      - in: path
	 *        name: id
	 *        required: true
	 *        schema:
	 *          type: number
	 *          description:
	 *            Id of the user
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#components/schemas/ChangeOtherUserPasswordDto'
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
	app.put(
		'/user/:id/change-password',
		rolesGuard(UserRole.ADMIN),
		(req: Request, res: Response, next: NextFunction) => {
			const id = Number(req.params.id);
			const dto: ChangeOtherUserPasswordDto = req.body;

			usersService
				.changeOtherUsersPassword(id, dto)
				.then(() => res.status(204).send())
				.catch(next);
		}
	);

	/**
	 * @swagger
	 * /admin/user/{id}:
	 *  delete:
	 *    summary: Soft deletes a user
	 *    tags:
	 *      - Users
	 *    parameters:
	 *      - in: path
	 *        name: id
	 *        required: true
	 *        schema:
	 *          type: number
	 *          description:
	 *            Id of the user
	 *    responses:
	 *      204:
	 *        description: User is soft deleted
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
	app.delete('/user/:id', rolesGuard(UserRole.ADMIN), (req: Request, res: Response, next: NextFunction) => {
		const id = Number(req.params.id);

		usersService
			.deleteUser(id)
			.then(() => res.status(204).send())
			.catch(next);
	});
}
