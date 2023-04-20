/**
 * @swagger
 * components:
 *  schemas:
 *    SwitchDto:
 *      type: object
 *      description: User session switch DTO
 *      properties:
 *        targetUserId:
 *          type: number
 *          description:
 *            Id of a new user
 */
export class SwitchDto {
	public targetUserId!: number;
}
