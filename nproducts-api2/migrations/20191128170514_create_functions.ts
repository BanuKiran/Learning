import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable('nist_functions', table => {
		table.increments('id').primary();
		table.dateTime('createdAt').notNullable();
		table.string('name').unique().notNullable();
	})
	.then(() => {
		return knex('nist_functions').insert({
			'name': 'ID1',
			'createdAt': new Date()
		});
	})
	;
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.dropTableIfExists('functions');
}

