import { User, UserRole } from '../models/user';

/**
 * @swagger
 * components:
 *  schemas:
 *    LoggedUserDto:
 *      type: object
 *      description: Data of the logged in user
 *      properties:
 *        id:
 *          type: number
 *          description:
 *            Identifier
 *        email:
 *          type: string
 *          description:
 *            Email address
 *        role:
 *          type: string
 *          description:
 *            Role identificator
 *        firstName:
 *          type: string
 *          required: false
 *          description:
 *            User first name
 *        lastName:
 *          type: string
 *          required: false
 *          description:
 *            User last name
 */
export class LoggedUserDto {
	public id?: number;
	public email?: string;
	public role!: UserRole;
	public firstName?: string | null;
	public lastName?: string | null;

	constructor(user: User) {
		this.id = user.id;
		this.email = user.email;
		this.role = user.role;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
	}
}
