import { Request } from 'express';

export class FiltersDto {
	public page!: number;
	public size!: number;
	public sort?: string;

	public static fromRequest(req: Request): FiltersDto {
		const filters = new FiltersDto();
		filters.page = Number(req.query.page || 0);
		filters.size = Number(req.query.size || 10);
		filters.sort = req.query.sort;
		return filters;
	}
}
