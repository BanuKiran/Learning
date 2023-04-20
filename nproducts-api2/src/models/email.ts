import { BaseModel } from './baseModel';

export class Email extends BaseModel {
	static get tableName() {
		return 'emails';
	}

	public email!: string;
}
