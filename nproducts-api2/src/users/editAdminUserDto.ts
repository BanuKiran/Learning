import { UserRole } from '../models/user';

/**
 * @swagger
 * components:
 *  schemas:
 *    EditAdminUserDto:
 *      type: object
 *      description: Dto new admin user data
 *      properties:
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
export class EditAdminUserDto {
	public role!: UserRole;
	public firstName!: string;
	public lastName!: string;
}
