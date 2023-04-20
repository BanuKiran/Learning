import { Application, NextFunction, Request, Response, Router } from 'express';
import nistFunctionsService from './nistFunctionService';
import { NistFunctionDto } from './NistFunctionDto';

export function register(app: Application | Router) {
	/**
	 * @swagger
	 * /client/nistfunctions:
	 *  post:
	 *    summary: Adds new nistFunction to the nistFunction database
	 *    tags:
	 *      - NistFunctions
	 *    requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *          schema:
	 *            $ref: '#components/schemas/NistFunctionDto'
	 *    responses:
	 *      204:
	 *        description: NistFunction is collected
	 *      400:
	 *        description: Validation error
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#components/schemas/ValidationErrorDto'
	 */
	app.post('/nistfunctions', (req: Request, res: Response, next: NextFunction) => {
		const dto: NistFunctionDto = req.body;
		nistFunctionsService
			.saveNistFunction(dto)
			.then(() => {
				res.status(204).send();
			})
			.catch(next);
	});

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
