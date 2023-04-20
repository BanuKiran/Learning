import { Application, Router, Request, Response, NextFunction } from 'express';
import emailsService from './emailsService';
import moment from 'moment';

export function register(app: Application | Router) {
	/**
	 * @swagger
	 * /admin/emails:
	 *  get:
	 *    summary: Returns all email addresses captured in the app
	 *    tags:
	 *      - Emails
	 *    responses:
	 *      200:
	 *        description: Email addresses are returned as a downloadable text file
	 */
	app.get('/emails', (req: Request, res: Response, next: NextFunction) => {
		emailsService
			.getEmails()
			.then(emails => {
				res
					.type('txt')
					.attachment(`oiap_email_addresses_${moment().format('YYYY-MM-DD_HH-mm-ss')}.txt`)
					.status(200)
					.send(emails.map(e => e.email).join('\r\n'));
			})
			.catch(next);
	});
}
