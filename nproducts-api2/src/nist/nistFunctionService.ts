import { NistFunctionDto } from './NistFunctionDto';

import { NistFunction } from '../models/nistFunction';
import { User, UserRole } from '../models/user';

class NistFunctionsService {
	public async saveNistFunction(dto: NistFunctionDto) {
		NistFunction.query()
			.insert({ name: dto.name })
			.then(() => console.log(`Email ${dto.name} added to function list`))
			.catch(() => console.log(`Duplicate function list nistFunction ${dto.name}`));
	}

	public async getNistFunctions() {
		return await NistFunction.query().orderBy('name', 'ASC');
	}
}

const nistFunctionsService = new NistFunctionsService();
export default nistFunctionsService;
