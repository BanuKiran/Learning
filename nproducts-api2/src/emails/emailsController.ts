import { Application, NextFunction, Request, Response, Router } from 'express';
import emailsService from './emailsService';
import { EmailDto } from './emailDto';

export function register(app: Application | Router) {
	/**
	 * @swagger
	 * /client/email:
	 *  post:
	 *    summary: Adds new email to the email database
	 *    tags:
	 *      - Emails
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#components/schemas/EmailDto'
	 *    responses:
	 *      204:
	 *        description: Email is collected
	 *      400:
	 *        description: Validation error
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#components/schemas/ValidationErrorDto'
	 */
	app.post('/email', (req: Request, res: Response, next: NextFunction) => {
		const dto: EmailDto = req.body;
		emailsService
			.saveEmail(dto, res.locals.currentUser)
			.then(() => {
				res.status(204).send();
			})
			.catch(next);
	});

	/**
	 * @swagger
	 * /client/email:
	 *  get:
	 *    summary: Get logged user email
	 *    tags:
	 *      - Emails
	 *    responses:
	 *      200:
	 *        description: Email is returned
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#components/schemas/UserEmailDto'
	 */
	app.get('/email', (req: Request, res: Response, next: NextFunction) => {
		emailsService
			.getLoggedUserEmail(res.locals.currentUser)
			.then(email => {
				res.status(200).send({ email });
			})
			.catch(next);
	});
}
