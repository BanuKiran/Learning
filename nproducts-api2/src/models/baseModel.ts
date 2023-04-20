import { Model, Pojo, ModelOptions } from 'objection';

export class BaseModel extends Model {
	public id!: number;
	public createdAt!: Date;

	public $beforeInsert() {
		this.createdAt = new Date();
	}

	public $validate(json: Pojo, opt: ModelOptions) {
		console.log(`${this.constructor.name}.$validate json: ${JSON.stringify(json)}`);
		return super.$validate(json, opt);
	}
}
