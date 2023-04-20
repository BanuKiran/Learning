import { BaseModel } from './baseModel';
import { User } from './user';
import { RelationMappings, Model } from 'objection';

export class ApiLoginEntry extends BaseModel {
	static get tableName() {
		return 'api_login_entries';
	}

	public logoutTime?: Date;
	public userId!: number;
	public user!: User;
	public adminUserId?: number;
	public adminUser?: User;
	public accessToken!: string;

	public static createNewForUser(user: User, accessToken: string, adminUser?: User): ApiLoginEntry {
		const entry = new ApiLoginEntry();
		entry.userId = user.id;
		entry.user = user;
		entry.accessToken = accessToken;
		if (adminUser) {
			entry.adminUserId = adminUser.id;
			entry.adminUser = adminUser;
		}
		return entry;
	}

	static get relationMappings(): RelationMappings {
		return {
			user: {
				relation: Model.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: 'api_login_entries.userId',
					to: 'users.id'
				}
			},
			adminUser: {
				relation: Model.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: 'api_login_entries.adminUserId',
					to: 'users.id'
				}
			}
		};
	}
}
