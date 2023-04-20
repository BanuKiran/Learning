import { RelationMappings, Model } from 'objection';
import { BaseModel } from './baseModel';

export class User extends BaseModel {
	static get tableName() {
		return 'users';
	}

	public email?: string;
	public password?: string;
	public role!: UserRole;

	public firstName?: string | null;
	public middleName?: string | null;
	public lastName?: string | null;
	public documents?: string | null;
	public phone?: string;

	public masterId?: number | null;
	public master?: User;

	public enabled!: boolean;

	static get relationMappings(): RelationMappings {
		return {
			master: {
				relation: Model.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: 'users.masterId',
					to: 'users.id'
				}
			}
		};
	}

	public static createAnonymous(): User {
		const user = new User();
		user.role = UserRole.ANON;
		user.enabled = true;
		return user;
	}

	public static createNewUser(email: string, password: string): User {
		const user = new User();
		user.email = email;
		user.password = password;
		user.role = UserRole.USER;
		user.enabled = true;
		return user;
	}

	public static createNewSubUser(masterId: number): User {
		const user = new User();
		user.masterId = masterId;
		user.role = UserRole.USER;
		user.enabled = true;
		return user;
	}

	public static createNewAdmin(
		email: string,
		password: string,
		role: UserRole,
		firstName: string,
		lastName: string
	): User {
		const user = new User();
		user.email = email;
		user.password = password;
		user.role = role;
		user.firstName = firstName;
		user.lastName = lastName;
		user.enabled = true;
		return user;
	}

	public get fullName(): string {
		return this.fullNameOrEmpty || this.email || 'Anonymous';
	}

	public get fullNameOrEmpty(): string | undefined {
		const name = [];
		if (this.firstName) {
			name.push(this.firstName);
		}
		if (this.middleName) {
			name.push(this.middleName);
		}
		if (this.lastName) {
			name.push(this.lastName);
		}
		return name.length ? name.join(' ') : undefined;
	}
}

export enum UserRole {
	ADMIN = 'ADMIN',
	USER = 'USER',
	ANON = 'ANON',
	BACK_OFFICE = 'BACK_OFFICE',
	ATTORNEY = 'ATTORNEY'
}

export function getClientRoles(): UserRole[] {
	return [UserRole.USER, UserRole.ANON];
}

export function getAdminRoles(): UserRole[] {
	return [UserRole.ADMIN, UserRole.BACK_OFFICE, UserRole.ATTORNEY];
}
