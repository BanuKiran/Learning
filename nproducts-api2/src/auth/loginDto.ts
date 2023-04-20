/**
 * @swagger
 * components:
 *  schemas:
 *    LoginDto:
 *      type: object
 *      description: Login dto with username and password
 *      properties:
 *        username:
 *          type: string
 *          description:
 *            User email
 *        password:
 *          type: string
 *          description:
 *            Password
 */
export class LoginDto {
	public username!: string;
	public password!: string;
}
