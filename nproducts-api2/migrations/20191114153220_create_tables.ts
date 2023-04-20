import * as Knex from "knex";
import bcrypt from "bcrypt";


export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable('users', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.dateTime('createdAt').notNullable();
		table.string('email').unique().notNullable();
		table.integer('role').notNullable();
		table.string('accessToken');
		table.string('password');
	})
	.then(() => {
		return knex('users').insert({
			'email': 'admin@itcraft.pl',
			'role': 1,
			'password': bcrypt.hashSync('test', 14),
			'createdAt': new Date()
		});
	})
	.then(() => {
		return knex('users').insert({
			'email': 'admin@ensar.com',
			'role': 2,
			'password': bcrypt.hashSync('test', 14),
			'createdAt': new Date()
		});
	});
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.dropTableIfExists('users');
}

