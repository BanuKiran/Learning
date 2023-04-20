/**
 * @swagger
 * components:
 *  schemas:
 *    UsersSelectDto:
 *      type: object
 *      description: Dto with array of users
 *      properties:
 *        uid:
 *          type: number
 *          description:
 *            Id of user
 *        name:
 *          type: string
 *          description:
 *            name of questionaire
 *        isMaster:
 *          type: boolean
 *          description:
 *            checks if master of questionaire
 *        isCurrent:
 *          type: boolean
 *          description:
 *            checks if curently login
 */
export class UsersSelectDto {
	public uid!: number;
	public name!: string;
	public isCurrent!: boolean;
	public isMaster!: boolean;
}
