import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
	return knex.schema.alterTable('users', table => {
		table.string('phone').nullable();
	});
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.alterTable('users', table => {
		table.dropColumn('phone');
	});
}

