import { User, UserRole } from '../models/user';

/**
 * @swagger
 * components:
 *  schemas:
 *    AdminUserDto:
 *      type: object
 *      description: Data of an admin user
 *      properties:
 *        id:
 *          type: number
 *          required: true
 *          description:
 *            Identifier
 *        email:
 *          type: string
 *          required: true
 *          description:
 *            Email address
 *        role:
 *          type: string
 *          required: true
 *          description:
 *            User role identificator
 *        firstName:
 *          type: string
 *          required: true
 *          description:
 *            First name
 *        lastName:
 *          type: string
 *          required: true
 *          description:
 *            Last name
 */
export class AdminUserDto {
	public id!: number;
	public email!: string;
	public role!: UserRole;
	public firstName!: string;
	public lastName!: string;

	constructor(user: User) {
		this.id = user.id;
		this.email = user.email as string;
		this.role = user.role;
		this.firstName = user.firstName as string;
		this.lastName = user.lastName as string;
	}
}
