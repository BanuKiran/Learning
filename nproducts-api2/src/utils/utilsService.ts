import { Request } from 'express';

import fs from 'fs';
import moment from 'moment';
import { ApiLoginEntry } from '../models/apiLoginEntry';

import { LoginTarget } from '../auth/loginTarget';
import jwt from 'jsonwebtoken';
const accessTokenSecret = 'somerandomaccesstoken';
const refreshTokenSecret = 'somerandomstringforrefreshtoken';
class UtilsService {
	private readonly defaultDateFormat = 'DD-MM-YYYY';

	public async getCurrentLoginEntry(req: Request, target: LoginTarget): Promise<ApiLoginEntry | null> {
		const authHeader = req.headers.authorization;

		if (authHeader) {
			const cookie = authHeader.split(' ')[1];
			//const cookie = (req.cookies && req.cookies[`${process.env.AUTH_TOKEN_COOKIE || 'AuthSu'}_${target}`]) || undefined;
			if (cookie !== undefined) {
				const fetched = await ApiLoginEntry.query()
					.joinEager('[user, adminUser]')
					.whereNull('logoutTime')
					.andWhere({ accessToken: cookie });
				if (fetched.length > 0) {
					return fetched[0];
				}
			}
			return null;
		}
		return null;
	}

	public async readFileContentAsync(filePath: string): Promise<Buffer> {
		return new Promise((resolve: (data: Buffer) => void, reject: (err: NodeJS.ErrnoException | null) => void) => {
			fs.readFile(filePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
				if (err) {
					reject(err);
				}
				resolve(data);
			});
		});
	}

	public dateFormat(date: string | number | Date, format = this.defaultDateFormat): string {
		return moment(date).format(format);
	}
}

const utilsService = new UtilsService();
export default utilsService;
