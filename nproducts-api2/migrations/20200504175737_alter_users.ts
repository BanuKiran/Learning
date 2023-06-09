import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
	return knex.schema.table('users', table => {
		table.string('middleName');
	})
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.table('users', table => {
		table.dropColumn('middleName');
	});
}

