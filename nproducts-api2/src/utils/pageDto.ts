/**
 * @swagger
 * components:
 *  schemas:
 *    PageDto:
 *      type: object
 *      description: Pagination data
 *      properties:
 *        content:
 *          type: array
 *          description: Page rows of an endpoint specific type
 *        items:
 *          type: object
 *        first:
 *          type: boolean
 *          description: True if first page is returned
 *        last:
 *          type: boolean
 *          description: True if last page is returned
 *        number:
 *          type: number
 *          description: Page number
 *        numberOfElements:
 *          type: number
 *          description: Number of returned rows
 *        size:
 *          type: number
 *          description: Page size
 *        totalElements:
 *          type: number
 *          description: Total number of all rows
 *        totalPages:
 *          type: number
 *          description: Total number of pages
 *        sort:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Sort'
 */
export class PageDto<T> {
	public content!: T[];
	public first!: boolean;
	public last!: boolean;
	public number!: number;
	public numberOfElements!: number;
	public size!: number;
	public totalElements!: number;
	public totalPages!: number;
	public sort?: Sort[];

	constructor(results: T[], page: number, pageSize: number, resultsTotal: number, sort?: Sort[]) {
		this.content = results;
		this.number = page;
		this.numberOfElements = results.length;
		this.size = pageSize;
		this.totalElements = resultsTotal;
		this.totalPages = Math.ceil(resultsTotal / pageSize);
		this.first = page === 0;
		this.last = page === this.totalPages - 1;
		this.sort = sort;
	}
}

/**
 * @swagger
 * components:
 *  schemas:
 *    Sort:
 *      type: object
 *      description: Table sort data
 *      properties:
 *        ascending:
 *          type: boolean
 *          description:
 *            True if ascending order
 *        descending:
 *          type: boolean
 *          description:
 *            True if descending order
 *        direction:
 *          type: string
 *          description:
 *            ASC if ascending, DESC if descending order
 *        property:
 *          type: string
 *          description:
 *            Property by which the sort was executed
 */
export class Sort {
	public ascending!: boolean;
	public descending!: boolean;
	public direction!: 'ASC' | 'DESC';
	public property!: string;

	constructor(direction: 'ASC' | 'DESC', property: string) {
		this.ascending = direction === 'ASC';
		this.descending = direction === 'DESC';
		this.direction = direction;
		this.property = property;
	}
}
