import { User, UserRole, getAdminRoles, getClientRoles } from '../models/user';
import { NextFunction, Response } from 'express';
import bcrypt from 'bcrypt';
import { LoginResultDto } from './loginResultDto';
import registrationValidator from './registrationValidator';
import { RegistrationDto } from './registrationDto';
import { PasswordUtils } from '../utils/passwordUtils';
import { Transaction } from 'objection';
import { ApiLoginEntry } from '../models/apiLoginEntry';
import { TransactionWrapper } from '../utils/transactionWrapper';
import { LoginTarget } from './loginTarget';
import { Errors, HttpError } from '../utils/errors';
import jwt from 'jsonwebtoken';

const accessTokenSecret = 'somerandomaccesstoken';
const refreshTokenSecret = 'somerandomstringforrefreshtoken';

class AuthService {
	private randomToken(length: number) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	private async sendCookieWithToken(
		user: User,
		target: LoginTarget,
		res: Response,
		adminUser?: User,
		trx?: Transaction
	): Promise<ApiLoginEntry> {
		const loginEntry = await this.generateAndSaveAccessToken({ user, adminUser, trx });
		this.sendAccessTokenCookie(res, loginEntry.accessToken, target);
		return loginEntry;
	}

	private async generateAndSaveAccessToken({
		user,
		adminUser,
		trx
	}: {
		user: User;
		adminUser?: User;
		trx?: Transaction;
	}) {
		await this.logout(user, adminUser, trx);
		const token = jwt.sign({ username: user.fullName, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
		////const token = this.randomToken(Number(process.env.AUTH_TOKEN_LENGTH) || 64);
		const loginEntry = ApiLoginEntry.createNewForUser(user, token, adminUser);

		return await ApiLoginEntry.query(trx).insert(loginEntry);
	}

	private sendAccessTokenCookie(res: Response, accessToken: string, target: LoginTarget) {
		res.cookie(`${process.env.AUTH_TOKEN_COOKIE || 'AuthSu'}_${target}`, accessToken, {
			httpOnly: true,
			maxAge: Number(process.env.AUTH_COOKIE_LIFE_DAYS) * 24 * 60 * 60 * 1000
		});
	}

	public async login(
		username: string,
		password: string,
		target: LoginTarget,
		res: Response,
		...roles: UserRole[]
	): Promise<LoginResultDto | null> {
		const user = await this.fetchUserByEmail(username, ...roles);
		if (!user) {
			return null;
		}

		const passwordMatches = await bcrypt.compare(password, user.password as string);
		if (!passwordMatches) {
			return null;
		}

		const loginEntry = await this.sendCookieWithToken(user, target, res);
		return new LoginResultDto(loginEntry);
	}
	public async switchUser(
		targetUserId: number,
		oldUserId: number,
		adminUser: User | undefined,
		target: LoginTarget,
		res: Response,
		...roles: UserRole[]
	): Promise<LoginResultDto | null> {
		const oldUser = await this.fetchUserById(oldUserId, ...roles);
		if (!oldUser) {
			return null;
		}
		if (targetUserId === oldUserId) {
			return null;
		}
		const masterAccountId = oldUser.masterId || oldUser.id;
		const isAllowed = await User.query()
			.where({ id: targetUserId })
			.andWhere(builder => {
				builder.where({ id: masterAccountId }).orWhere({ masterId: masterAccountId });
			});
		if (!isAllowed) {
			return null;
		}
		const newUser = await this.fetchUserById(targetUserId, ...roles);
		if (!newUser) {
			return null;
		}
		const loginEntry = await this.sendCookieWithToken(newUser, target, res, adminUser);
		if (newUser.masterId) {
			const masterUser = await User.query().findById(masterAccountId);
			if (masterUser) {
				loginEntry.user.email = masterUser.email;
			}
		}
		return new LoginResultDto(loginEntry);
	}
	public async adminLogin(
		adminUsername: string,
		clientUsername: string,
		password: string,
		userId: number | undefined,
		target: LoginTarget,
		res: Response
	): Promise<LoginResultDto | null> {
		const adminUser = await this.fetchUserByEmail(adminUsername, ...getAdminRoles());
		if (!adminUser) {
			return null;
		}

		const passwordMatches = await bcrypt.compare(password, adminUser.password as string);
		if (!passwordMatches) {
			return null;
		}

		let clientUser = await this.fetchUserByEmail(clientUsername, ...getClientRoles());
		if (!clientUser) {
			return null;
		}
		const mainEmail = clientUser.email;

		if (userId && userId !== clientUser.id) {
			const subUser = await this.fetchUserById(userId, ...getClientRoles());
			if (!subUser || subUser.masterId !== clientUser.id) {
				return null;
			}
			clientUser = subUser;
		}

		const loginEntry = await this.sendCookieWithToken(clientUser, target, res, adminUser);
		loginEntry.user.email = mainEmail;
		return new LoginResultDto(loginEntry);
	}

	private async fetchUserByEmail(email: string, ...roles: UserRole[]) {
		const fetched = await User.query()
			.whereRaw('LOWER(email) = ?', email.toLowerCase())
			.andWhere({ enabled: true })
			.andWhere({ masterId: null })
			.andWhere('role', 'IN', roles);
		if (fetched.length === 0) {
			return null;
		}
		return fetched[0];
	}

	private async fetchUserById(targetUserId: number, ...roles: UserRole[]) {
		const fetched = await User.query()
			.where({ id: targetUserId })
			.andWhere({ enabled: true })
			.andWhere('role', 'IN', roles);
		if (fetched.length === 0) {
			return null;
		}
		return fetched[0];
	}

	public async logout(user: User, adminUser?: User, trx?: Transaction) {
		const query = ApiLoginEntry.query(trx)
			.patch({ logoutTime: new Date() })
			.whereNull('logoutTime')
			.andWhere({ userId: user.id });

		if (adminUser) {
			query.andWhere({ adminUserId: adminUser.id });
		}

		await query;
	}

	public async registerAnon(res: Response): Promise<LoginResultDto> {
		const newUser = User.createAnonymous();

		const entry = await TransactionWrapper.wrap(async trx => {
			const createdUser = await User.query(trx).insert(newUser);

			const loginEntry = await this.generateAndSaveAccessToken({ user: createdUser, trx });
			return loginEntry;
		});

		this.sendAccessTokenCookie(res, entry.accessToken, LoginTarget.CLIENT);
		return new LoginResultDto(entry);
	}

	public async makeUserPermanent(dto: RegistrationDto, user: User): Promise<LoginResultDto> {
		await registrationValidator.validate(dto, user.id);
		const passwordHash = await PasswordUtils.hash(dto.password);
		const entry = await TransactionWrapper.wrap(async trx => {
			await user.$query(trx).patch({
				email: dto.email,
				password: passwordHash,
				role: UserRole.USER
			});
			const entries = await ApiLoginEntry.query(trx)
				.joinEager('[user, adminUser]')
				.whereNull('logoutTime')
				.andWhere({ userId: user.id });

			return entries[0];
		});

		return new LoginResultDto(entry);
	}

	public async registerNewUser(dto: RegistrationDto, res: Response): Promise<LoginResultDto> {
		await registrationValidator.validate(dto);
		const passwordHash = await PasswordUtils.hash(dto.password);

		const entry = await TransactionWrapper.wrap(async trx => {
			const newUser = User.createNewUser(dto.email, passwordHash);
			const registeredUser = await User.query().insert(newUser);

			const loginEntry = await this.generateAndSaveAccessToken({ user: registeredUser, trx });
			return loginEntry;
		});

		this.sendAccessTokenCookie(res, entry.accessToken, LoginTarget.CLIENT);
		return new LoginResultDto(entry);
	}

	public async registerSubUser(user: User, next: NextFunction) {
		return await TransactionWrapper.wrap(async trx => {
			const masterId = user.masterId || user.id;
			const total = await User.query(trx).where({ masterId: masterId, enabled: true });
			const questionaireLimit = 5;
			if (total.length + 1 >= questionaireLimit) {
				next(new HttpError(Errors.LIMIT_EXCEEDED));
				return;
			}

			const newUser = User.createNewSubUser(masterId);
			const insertedUser = await User.query(trx).insert(newUser);

			return await this.getUsersTree(user, trx);
		});
	}

	public async getUsersTree(user: User, trx?: Transaction) {
		const masterAccountId = user.masterId || user.id;
		const accounts = (await User.query(trx)
			.select('que.answer', 'users.*')

			.where('users.enabled', true)
			.andWhere(builder => {
				builder.where('users.id', masterAccountId).orWhere('users.masterId', masterAccountId);
			})
			.orderBy('users.id', 'ASC')) as UserWithAnswer[];

		const entries = accounts.map((account, index) => ({
			id: account.id,
			name: (() => {
				if (account.firstName) {
					return `${account.firstName}'s application`;
				}

				return `Questionnaire #${index + 1}`;
			})(),
			isMaster: account.id === masterAccountId,
			isCurrent: account.id === user.id
		}));

		return { users: entries };
	}
}

interface UserWithAnswer extends User {
	answer: string;
}

const authService = new AuthService();
export default authService;
