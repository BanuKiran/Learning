import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { Router, Request, Response, NextFunction } from 'express';
import Knex from 'knex';
import { Model } from 'objection';
import * as dbConfig from '../knexfile';
import * as usersController from './users/usersController';
import * as adminAuthController from './auth/adminAuthController';
import * as adminChangePasswordController from './users/adminChangePasswordController';
import * as clientAuthController from './auth/clientAuthController';
import * as clientChangePasswordController from './users/clientChangePasswordController';
import * as emailsController from './emails/emailsController';
import * as adminEmailsController from './emails/adminEmailsController';
import * as adminNistFunctionsController from './nist/adminNistFunctionsController';
import * as nistFunctionsController from './nist/nistFunctionsController';
import { authGuard } from './auth/authGuard';
import { errorHandler, Errors } from './utils/errors';
import swaggerDocs from './config/swagger.config';
import path from 'path';
import { getAdminRoles, getClientRoles } from './models/user';

import fileUpload from 'express-fileupload';
import pg from 'pg';
import { LoginTarget } from './auth/loginTarget';
import cors from 'cors';
import jwt from 'jsonwebtoken';

/*
	Workaround for this issue https://github.com/knex/knex/issues/387
	More info here https://github.com/brianc/node-pg-types
*/
pg.types.setTypeParser(20, parseInt); // bigint
pg.types.setTypeParser(1700, Number); // numeric

dotenv.config();
const port = process.env.SERVER_PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(
	fileUpload({
		createParentPath: true,
		limits: { fileSize: Number(process.env.FILE_SIZE_LIMIT || 52428800) },
		limitHandler: (req: Request, res: Response) => {
			res.locals.fileTooBig = true;
		}
	}),
	(req: Request, res: Response, next: NextFunction) => {
		if (res.locals.fileTooBig) {
			res.status(400).send(Errors.FILE_TOO_BIG);
		} else {
			next();
		}
	}
);
app.use(cors());

const knex = Knex(dbConfig.getConfig());
console.log('process.env.DB_HOST', process.env.DB_NAME);
knex.migrate.latest();
Model.knex(knex);

// Output sql statements for debugging
if (process.env.DEBUG_SQL && process.env.DEBUG_SQL === 'true') {
	knex.on('query', data => {
		console.dir(data.sql);
	});
}

app.get('/', (req, res) => {
	res.send('API is working!');
});

const adminRouter = Router();
const clientRouter = Router();

adminRouter.get('/', (req, res) => {
	res.send('Admin API is working!');
});

clientRouter.get('/', (req, res) => {
	res.send('Client API is working!');
});

// Not authorized
adminAuthController.register(adminRouter);
clientAuthController.register(clientRouter);

swaggerDocs(app);

app.use(cookieParser());

const assetsPath = process.env.NODE_ENV === 'development' ? 'public' : path.resolve(__dirname, '../public');
adminRouter.use('/assets', express.static(assetsPath));
clientRouter.use('/assets', express.static(assetsPath));

// All requests registered after authGuard will need to be authorized
adminRouter.use(authGuard(LoginTarget.ADMIN, ...getAdminRoles()));
clientRouter.use(authGuard(LoginTarget.CLIENT, ...getClientRoles()));

// Authorized admin
usersController.register(adminRouter);

adminEmailsController.register(adminRouter);
emailsController.register(clientRouter);

adminNistFunctionsController.register(adminRouter);
nistFunctionsController.register(clientRouter);

adminChangePasswordController.register(adminRouter);

// Authorized client
clientChangePasswordController.register(clientRouter);

app.use('/admin', adminRouter);
app.use('/client', clientRouter);
app.use(errorHandler);

process.on('unhandledRejection', err => {
	console.log(err);
});

const accessTokenSecret = 'somerandomaccesstoken';
const refreshTokenSecret = 'somerandomstringforrefreshtoken';

const users = [
	{
		username: 'john',
		password: 'password123admin',
		role: 'admin'
	},
	{
		username: 'anna',
		password: 'password123member',
		role: 'member'
	}
];

let refreshTokens: any[] = [];

app.use(bodyParser.json());

app.post('/login', (req, res) => {
	// read username and password from request body
	const { username, password } = req.body;

	// filter user from the users array by username and password
	const user = users.find(u => {
		return u.username === username && u.password === password;
	});

	if (user) {
		// generate an access token
		const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
		const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);

		refreshTokens.push(refreshToken);

		res.json({
			accessToken,
			refreshToken
		});
	} else {
		res.send('Username or password incorrect');
	}
});

app.post('/token', (req, res) => {
	const { token } = req.body;
	console.log(req.body);
	if (!token) {
		return res.sendStatus(401);
	}

	if (!refreshTokens.includes(token)) {
		return res.sendStatus(403);
	}

	jwt.verify(token, refreshTokenSecret, (err: any, user: any) => {
		if (err) {
			return res.sendStatus(403);
		}

		const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });

		res.json({
			accessToken
		});
	});
});

app.post('/logout', (req, res) => {
	const { token } = req.body;
	refreshTokens = refreshTokens.filter(t => t !== token);

	res.send('Logout successful');
});

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split(' ')[1];

		jwt.verify(token, accessTokenSecret, (err, user) => {
			if (err) {
				return res.sendStatus(403);
			}

			//req.user = user;
			next();
		});
	} else {
		res.sendStatus(401);
	}
};

const books = [
	{
		author: 'Chinua Achebe',
		country: 'Nigeria',
		language: 'English',
		pages: 209,
		title: 'Things Fall Apart',
		year: 1958
	},
	{
		author: 'Hans Christian Andersen',
		country: 'Denmark',
		language: 'Danish',
		pages: 784,
		title: 'Fairy tales',
		year: 1836
	},
	{
		author: 'Dante Alighieri',
		country: 'Italy',
		language: 'Italian',
		pages: 928,
		title: 'The Divine Comedy',
		year: 1315
	}
];

app.get('/books', authenticateJWT, (req, res) => {
	res.json(books);
});

app.listen(port, () => {
	console.log(`App listening on http://localhost:${port}`);
});
