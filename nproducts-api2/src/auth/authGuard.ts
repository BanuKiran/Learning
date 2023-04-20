import { Request, Response, NextFunction } from 'express';
import utilsService from './../utils/utilsService';
import { UserRole } from '../models/user';
import { LoginTarget } from './loginTarget';

export function authGuard(target: LoginTarget, ...roles: UserRole[]) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const entry = await utilsService.getCurrentLoginEntry(req, target);
		if (entry && (roles.length === 0 || roles.includes(entry.user.role))) {
			res.locals.currentUser = entry.user;
			res.locals.currentAdminUser = entry.adminUser;
			next();
		} else {
			res.status(401).send('unauthorized');
		}
	};
}
