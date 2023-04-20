import { UserRole } from '../models/user';

/**
 * @swagger
 * components:
 *  schemas:
 *    CreateNewAdminUserDto:
 *      type: object
 *      description: Dto new admin user data
 *      properties:
 *        email:
 *          type: string
 *          required: true
 *          description:
 *            Email of the admin
 *        password:
 *          type: string
 *          required: true
 *          description:
 *            Password to be set
 *        role:
 *          type: string
 *          emun: [ADMIN, BACK_OFFICE, ATTORNEY]
 *          required: true
 *          description:
 *            User role
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
export class CreateNewAdminUserDto {
	public email!: string;
	public password!: string;
	public role!: UserRole;
	public firstName!: string;
	public lastName!: string;
}
