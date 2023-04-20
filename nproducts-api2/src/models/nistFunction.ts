import { BaseModel } from './baseModel';

export class NistFunction extends BaseModel {
	static get tableName() {
		return 'nist_functions';
	}

	public name!: string;
}
