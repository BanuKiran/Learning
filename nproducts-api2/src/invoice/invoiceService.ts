import { EmailDto } from './invoiceDto';
import emailsValidator from './emailsValidator';
import { Email } from '../models/email';
import { User, UserRole } from '../models/user';

class InvoiceService {
	public async saveEmail(dto: EmailDto, user: User) {
		await emailsValidator.validate(dto, user);
		if (dto.forMailingList) {
			Email.query()
				.insert({ email: dto.email })
				.then(() => console.log(`Email ${dto.email} added to mailing list`))
				.catch(() => console.log(`Duplicate mailing list email ${dto.email}`));
		}
		if (user.role === UserRole.ANON) {
			await user.$query().patch({ email: dto.email });
		}
	}

	public async getEmails() {
		return await Invoice.query().orderBy('email', 'ASC');
	}

	public async getLoggedUserEmail(currentUser: User) {
		return currentUser.email;
	}
}

const emailsService = new EmailsService();
export default emailsService;
