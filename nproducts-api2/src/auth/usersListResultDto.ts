import { UsersSelectDto } from './usersSelectDto';
/**
 * @swagger
 * components:
 *  schemas:
 *    UsersListResultDto:
 *      type: object
 *      description: Dto with users for given user
 *      properties:
 *        users:
 *          type: array
 *          required: true
 *          description:
 *            Array of users
 *          items:
 *            $ref: '#/components/schemas/UsersSelectDto'
 */
export class UsersListResultDto {
	public users!: UsersSelectDto[];
}
