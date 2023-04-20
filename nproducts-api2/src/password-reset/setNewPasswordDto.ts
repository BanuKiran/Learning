/**
 * @swagger
 * components:
 *  schemas:
 *    SetNewPasswordDto:
 *      type: object
 *      description: Dto with password reset token and new password
 *      properties:
 *        token:
 *          type: string
 *          required: true
 *          description:
 *            Password reset token
 *        newPassword:
 *          type: string
 *          required: true
 *          description:
 *            New password to be set
 */
export class SetNewPasswordDto {
	public token!: string;
	public newPassword!: string;
}
