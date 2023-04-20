import { Request, Response, NextFunction } from 'express';
import { ChangePasswordDto } from './changePasswordDto';
import usersService from './usersService';

export function changePassword(req: Request, res: Response, next: NextFunction) {
	const dto: ChangePasswordDto = req.body;
	usersService
		.changePassword(dto.oldPassword, dto.newPassword, res.locals.currentUser)
		.then(() => res.status(204).send())
		.catch(next);
}
