/**
 * @swagger
 * components:
 *  schemas:
 *    ChangeOtherUserPasswordDto:
 *      type: object
 *      description: Dto with new password
 *      properties:
 *        password:
 *          type: string
 *          required: true
 *          description:
 *            New user password to be set
 */
export class ChangeOtherUserPasswordDto {
	public password!: string;
}
