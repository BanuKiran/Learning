/**
 * @swagger
 * components:
 *  schemas:
 *    PasswordResetDto:
 *      type: object
 *      description: Dto with an email address for password reset
 *      properties:
 *        email:
 *          type: string
 *          required: true
 *          description:
 *            Email for password reset
 */
export class PasswordResetDto {
	public email!: string;
}
