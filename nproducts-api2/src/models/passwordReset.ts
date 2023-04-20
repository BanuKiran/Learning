import { BaseModel } from './baseModel';
import { User } from './user';
import { RelationMappings, Model } from 'objection';

export class PasswordReset extends BaseModel {
	static get tableName() {
		return 'password_resets';
	}

	public userId!: number;
	public user!: User;
	public token!: string;

	static get relationMappings(): RelationMappings {
		return {
			user: {
				relation: Model.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: 'password_resets.userId',
					to: 'users.id'
				}
			}
		};
	}
}
