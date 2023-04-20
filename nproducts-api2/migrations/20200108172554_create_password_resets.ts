import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable('password_resets', table => {
		table.increments('id').primary();
		table.dateTime('createdAt').notNullable();
		table.integer('userId').notNullable().references('users.id');
		table.string('token').notNullable();
	});
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.dropTableIfExists('password_resets');
}

