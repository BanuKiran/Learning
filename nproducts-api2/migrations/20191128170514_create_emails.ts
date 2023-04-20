import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable('emails', table => {
		table.increments('id').primary();
		table.dateTime('createdAt').notNullable();
		table.string('email').unique().notNullable();
	})
	.then(() => {
		return knex('emails').insert({
			'email': 'admin@itcraft.pl',
			'createdAt': new Date()
		});
	})
	;
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.dropTableIfExists('emails');
}

