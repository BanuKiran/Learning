/**
 * @swagger
 * components:
 *  schemas:
 *    ChangePasswordDto:
 *      type: object
 *      description: Dto with old and new password
 *      properties:
 *        oldPassword:
 *          type: string
 *          required: true
 *          description:
 *            Current user password
 *        newPassword:
 *          type: string
 *          required: true
 *          description:
 *            New user password to be set
 */
export class ChangePasswordDto {
	public oldPassword!: string;
	public newPassword!: string;
}
