/**
 * @swagger
 * components:
 *  schemas:
 *    AdminLoginDto:
 *      type: object
 *      description: Login dto with username and password
 *      properties:
 *        adminUsername:
 *          type: string
 *          description:
 *            Admin user email
 *        clientUsername:
 *          type: string
 *          description:
 *            Client user email
 *        password:
 *          type: string
 *          description:
 *            Password
 *        userId:
 *          type: number
 *          required: false
 *          description:
 *            Id of the account (or subaccount) to be logged in as
 */
export class AdminLoginDto {
	public adminUsername!: string;
	public clientUsername!: string;
	public password!: string;
	public userId?: number;
}
