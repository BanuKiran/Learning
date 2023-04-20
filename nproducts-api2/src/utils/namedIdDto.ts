/**
 * @swagger
 * components:
 *  schemas:
 *    NamedIdDto:
 *      type: object
 *      description: Dto with id and associated name
 *      properties:
 *        id:
 *          type: number
 *          description: Object id
 *        name:
 *          type: string
 *          description: Object name
 */
export class NamedIdDto {
	public id!: number;
	public name!: string;

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}
}
