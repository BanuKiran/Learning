/**
 * @swagger
 * components:
 *  schemas:
 *    RegistrationDto:
 *      type: object
 *      description: Registration dto with email and password
 *      properties:
 *        email:
 *          type: string
 *          description:
 *            User email
 *        password:
 *          type: string
 *          description:
 *            Password
 */
export class RegistrationDto {
	public email!: string;
	public password!: string;
}
