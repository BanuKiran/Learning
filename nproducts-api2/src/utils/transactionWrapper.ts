import { Transaction, Model } from 'objection';
import { HttpError, Errors } from './errors';

export class TransactionWrapper {
	public static async wrap<T>(wrappedFunc: (trx: Transaction) => Promise<T>): Promise<T> {
		try {
			return await Model.knex().transaction(wrappedFunc);
		} catch (err) {
			console.error(err);
			if (Error.name === err.name) {
				throw err;
			} else {
				throw new HttpError(Errors.INVALID_DATA);
			}
		}
	}
}
