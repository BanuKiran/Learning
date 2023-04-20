/**
 * @swagger
 * components:
 *  schemas:
 *    EmailDto:
 *      type: object
 *      description: Dto with an email address to be collected
 *      properties:
 *        email:
 *          type: string
 *          required: true
 *          description:
 *            Email to be collected
 *        forMailingList:
 *          type: boolean
 *          required: true
 *          description:
 *            If user agrees to be added to the mailing list then true
 */
export class EmailDto {
	public email!: string;
	public forMailingList!: boolean;
}
