import { Application, Router, Request, Response, NextFunction } from 'express';
import nistFunctionsService from './nistFunctionService';

export function register(app: Application | Router) {
	/**
	 * @swagger
	 * /admin/nistFunctions:
	 *  get:
	 *    summary: Returns all nistFunction addresses captured in the app
	 *    tags:
	 *      - NistFunctions
	 *    responses:
	 *      200:
	 *        description: NistFunction addresses are returned as a downloadable text file
	 */
	app.get('/nistfunctions', (req: Request, res: Response, next: NextFunction) => {
		nistFunctionsService
			.getNistFunctions()
			.then(nistFunctions => {
				res.status(200).send(nistFunctions.map(e => e.name).join('\r\n'));
			})
			.catch(next);
	});
}
