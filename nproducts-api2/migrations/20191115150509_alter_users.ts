import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
	return knex.schema.alterTable('users', table => {
		table.string('role').alter();
	})
	.then(() => {
		return knex('users').update({
			role: 'ADMIN'
		});
	});
}


export async function down(knex: Knex): Promise<any> {
	return knex('users').update({
		role: 1
	})
	.then(() => {
		return knex.schema.alterTable('users', table => {
			table.integer('role').alter();
		});
	});
}

