import { PasswordResetDto } from './passwordResetDto';
import usersService from '../users/usersService';
import mailerService, { commonEmailAttachments } from '../utils/mailerService';
import { PasswordReset } from '../models/passwordReset';
import template from '../email-templates/passwordReset.template';
import uuid from 'uuid-random';
import { SetNewPasswordDto } from './setNewPasswordDto';
import setNewPasswordValidator from './setNewPasswordValidator';
import { PasswordUtils } from '../utils/passwordUtils';
import { TransactionWrapper } from '../utils/transactionWrapper';
import { Transaction } from 'objection';
import { UserRole } from '../models/user';

class PasswordResetService {
	public async resetPassword(dto: PasswordResetDto) {
		const user = await usersService.findUserByEmail(dto.email);
		if (!user) {
			return;
		}

		const token = uuid();
		const passwordReset = await PasswordReset.query().insert({ userId: user.id, token: token });
		const appName = process.env.APP_NAME || 'VisaNation';
		mailerService.sendMail({
			to: user.email,
			subject: `${appName} Password reset`,
			html: template({
				passwordReset,
				redirectUrl:
					(user.role === UserRole.USER ? process.env.APP_FRONT_URL : process.env.APP_ADMIN_FRONT_URL) ||
					'http://localhost:8080'
			}),
			attachments: commonEmailAttachments
		});
	}

	public async setNewPassword(dto: SetNewPasswordDto) {
		const passwordReset = await this.findPasswordResetByToken(dto.token);
		setNewPasswordValidator.validate(dto);
		const user = passwordReset.user;
		const passwordHash = await PasswordUtils.hash(dto.newPassword);

		await TransactionWrapper.wrap(async (trx: Transaction) => {
			await user.$query(trx).patch({ password: passwordHash });
			await PasswordReset.query(trx)
				.where({ userId: user.id })
				.delete();
		});
	}

	private async findPasswordResetByToken(token: string): Promise<PasswordReset> {
		const fetched = await PasswordReset.query()
			.joinEager('user')
			.where({ token });
		if (fetched.length !== 1) {
			throw new Error('Password reset not found');
		}
		return fetched[0];
	}
}

const passwordResetService = new PasswordResetService();
export default passwordResetService;
