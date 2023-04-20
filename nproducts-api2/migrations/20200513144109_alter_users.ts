import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
	return knex.schema.table('users', table => {
		table.boolean('enabled').notNullable().defaultTo(true);
	});
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.table('users', table => {
		table.dropColumn('enabled');
	});
}

