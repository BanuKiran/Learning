import { LoggedUserDto } from './loggedUserDto';
import { User } from '../models/user';
import { ApiLoginEntry } from '../models/apiLoginEntry';

/**
 * @swagger
 * components:
 *  schemas:
 *    LoginResultDto:
 *      type: object
 *      description: Data of the logged in user
 *      properties:
 *        accessToken:
 *          type: string
 *          description:
 *            Access token for the logged in user
 *        user:
 *          type: object
 *          description:
 *            Data of the logged in user
 *          $ref: '#/components/schemas/LoggedUserDto'
 *        adminUser:
 *          type: object
 *          required: false
 *          description:
 *            Data of the logged in admin user for admin login to client panel if any
 *          $ref: '#/components/schemas/LoggedUserDto'
 */
export class LoginResultDto {
	public accessToken!: string;
	public user!: LoggedUserDto;
	public adminUser?: LoggedUserDto;

	constructor(apiLoginEntry: ApiLoginEntry) {
		this.accessToken = apiLoginEntry.accessToken || '';
		this.user = new LoggedUserDto(apiLoginEntry.user);
		if (apiLoginEntry.adminUser) {
			this.adminUser = new LoggedUserDto(apiLoginEntry.adminUser);
		}
	}
}
