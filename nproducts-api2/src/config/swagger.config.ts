import * as swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import express from 'express';

const config: swaggerJsdoc.Options = {
	swaggerDefinition: {
		components: {},
		openapi: '3.0.0',
		info: {
			title: 'OIAP API',
			version: '1.0.0',
			description: 'OIAP API'
		},
		basePath: '/'
	},
	apis: [
		'./**/*Controller.ts',
		'./**/*Dto.ts',
		'./src/utils/errors.ts',
		'./src/utils/ValidationErrorDto.ts',
		'./**/*Controller.js',
		'./**/*Dto.js',
		'./src/utils/errors.js',
		'./src/utils/ValidationErrorDto.js'
	],
	securityDefinitions: {
		auth: {
			type: 'apiKey',
			in: 'cookie',
			name: 'AuthSu'
		}
	},
	security: [{ auth: [] }]
};

const specs = swaggerJsdoc(config);

const expose = (app: express.Application) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export default expose;

/** Common & reusable swagger definitions
 * * Prefer to document specific schema details wherever the model interface is defined
 * * e.g. Define specific schema for UserProfileDto where this interface is defined
 * ! BUT NOT before the interface declaration because it gets lost during transpilation
 */
