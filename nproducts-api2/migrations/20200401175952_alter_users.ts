import * as Knex from "knex";
import { UserRole } from '../src/models/user';


export async function up(knex: Knex): Promise<any> {
	return knex.schema.table('users', table => {
		table.string('firstName');
		table.string('lastName');
		table.string('title');
	}).then(() => {
		return knex('users')
			.where('role', '=', UserRole.ADMIN)
			.update({ title: 'Back office staff member' });
	});
}


export async function down(knex: Knex): Promise<any> {
	return knex.schema.table('users', table => {
		table.dropColumn('firstName');
		table.dropColumn('lastName');
		table.dropColumn('title');
	});
}

