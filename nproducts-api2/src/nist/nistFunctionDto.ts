/**
 * @swagger
 * components:
 *  schemas:
 *    NistFunctionDto:
 *      type: object
 *      description: Dto with an nistFunction address to be collected
 *      properties:
 *        nistFunction:
 *          type: string
 *          required: true
 *          description:
 *            NistFunction to be collected
 */
export class NistFunctionDto {
	public name!: string;
}
