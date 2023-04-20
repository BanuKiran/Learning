/**
 * @swagger
 * components:
 *  schemas:
 *    UserEmailDto:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          required: true
 */
export class UserEmailDto {
	public email!: string;
}
