import { User, getAdminRoles } from '../models/user';
import { UserOnListDto } from './userOnListDto';
import bcrypt from 'bcrypt';
import { HttpError, Errors } from '../utils/errors';
import { PasswordUtils } from '../utils/passwordUtils';
import { CreateNewAdminUserDto } from './createNewAdminUserDto';
import newAdminUserValidator from './newAdminUserValidator';
import editAdminUserValidator from './editAdminUserValidator';
import { AdminUserDto } from './adminUserDto';
import passwordValidator from './passwordValidator';
import { ChangeOtherUserPasswordDto } from './changeOtherUserPasswordDto';
import { FiltersDto } from '../utils/filtersDto';
import { PageDto } from '../utils/pageDto';
import { TransactionWrapper } from '../utils/transactionWrapper';
import { EditAdminUserDto } from './editAdminUserDto';

class UsersService {
	public async getUsersList(filters: FiltersDto): Promise<PageDto<UserOnListDto>> {
		const query = User.query()
			.where({ enabled: true })
			.andWhere('role', 'IN', getAdminRoles())
			.page(filters.page, filters.size);

		if (filters.sort) {
			const orders = filters.sort.split(',');
			for (let i = 0; i < orders.length; i += 2) {
				query.orderBy(orders[i], orders[i + 1]);
			}
		}

		const page = await query.orderBy('email', 'asc');
		return new PageDto<UserOnListDto>(
			page.results.map(u => new UserOnListDto(u)),
			filters.page,
			filters.size,
			page.total
		);
	}

	public async changePassword(oldPassword: string, newPassword: string, user: User) {
		if (!newPassword) {
			throw new HttpError(Errors.FIELD_REQUIRED);
		}
		const oldPasswordMatches = await bcrypt.compare(oldPassword, user.password as string);
		if (!oldPasswordMatches) {
			throw new HttpError(Errors.INCORRECT_PASSWORD);
		}

		passwordValidator.validate({ password: newPassword }, 'newPassword');

		const hash = await PasswordUtils.hash(newPassword);

		await user.$query().patch({ password: hash });
	}

	public async changeOtherUsersPassword(userId: number, dto: ChangeOtherUserPasswordDto) {
		passwordValidator.validate(dto);

		const hash = await PasswordUtils.hash(dto.password);
		await User.query()
			.findById(userId)
			.patch({ password: hash });
	}

	public async findUserByEmail(email: string): Promise<User | null> {
		const fetched = await User.query().where({ email });

		if (fetched.length !== 1) {
			return null;
		}

		return fetched[0];
	}

	public async createNewAdminUser(dto: CreateNewAdminUserDto): Promise<AdminUserDto> {
		await newAdminUserValidator.validate(dto);

		const hash = await PasswordUtils.hash(dto.password);
		const newUser = User.createNewAdmin(dto.email, hash, dto.role, dto.firstName, dto.lastName);
		const insertedUser = await User.query().insert(newUser);

		return new AdminUserDto(insertedUser);
	}

	public async editAdminUser(userId: number, dto: EditAdminUserDto): Promise<AdminUserDto> {
		editAdminUserValidator.validate(dto);
		const editedUser = await User.query().patchAndFetchById(userId, dto);
		return new AdminUserDto(editedUser);
	}

	public async deleteUser(userId: number) {
		await TransactionWrapper.wrap(async trx => {
			

			await User.query(trx)
				.findById(userId)
				.patch({ enabled: false });
		});
	}
}

const usersService = new UsersService();
export default usersService;
