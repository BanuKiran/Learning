import { Request, Response, NextFunction } from 'express';
import { UserRole, User } from '../models/user';

export function rolesGuard(...roles: UserRole[]) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const user: User = res.locals.currentUser;
		if (roles.includes(user.role)) {
			next();
		} else {
			res.status(401).send('unauthorized');
		}
	};
}
