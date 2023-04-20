import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
	return knex.schema.alterTable('users', table => {
		table.string('email').nullable().alter();
		table.string('password').nullable().alter();
	});
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.alterTable('users', table => {
		table.string('email').notNullable().alter();
		table.string('password').notNullable().alter();
	});
}

