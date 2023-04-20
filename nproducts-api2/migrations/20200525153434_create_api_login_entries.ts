import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
	return knex.schema.createTable('api_login_entries', table => {
		table.increments('id').primary();
		table.dateTime('createdAt').notNullable();
		table.dateTime('logoutTime');
		table.integer('userId').notNullable().references('users.id');
		table.integer('adminUserId').references('users.id');
		table.string('accessToken');
	}).then(() => {
		return knex.schema.alterTable('users', table => {
			table.dropColumn('accessToken');
		});
	});
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.dropTable('api_login_entries')
		.then(() => {
			return knex.schema.alterTable('users', table => {
				table.string('accessToken');
			});
		});
}

