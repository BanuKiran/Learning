import dotenv from 'dotenv';
import { knexSnakeCaseMappers } from 'objection';

dotenv.config();
const CONFIG_NAME = process.env.NODE_ENV || 'development';

const dbConfig: any = {
	getConfig: () => dbConfig[CONFIG_NAME]
};

dbConfig[CONFIG_NAME] = {
	client: 'postgresql',
	connection: {
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT || 5432,
		database: process.env.DB_NAME || 'ensar',
		user: process.env.DB_USER || 'postgres',
		password: process.env.DB_PASSWORD || 'postgres'
	},
	migrations: {
		directory: 'migrations',
		extension: CONFIG_NAME === 'development' ? 'ts' : 'js'
	},
	...knexSnakeCaseMappers()
};

export = dbConfig;
