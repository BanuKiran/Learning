import { GlobalErrorDto, FieldErrorDto, ValidationErrorDto } from './validationErrorDto';

export class ValidationErrors {
	public globalErrors?: GlobalErrorDto[];
	public fieldErrors?: FieldErrorDto[];

	public addFieldError(fieldError: FieldErrorDto) {
		if (!this.fieldErrors) {
			this.fieldErrors = [];
		}
		this.fieldErrors.push(fieldError);
	}

	public addGlobalError(globalError: GlobalErrorDto) {
		if (!this.globalErrors) {
			this.globalErrors = [];
		}
		this.globalErrors.push(globalError);
	}

	public hasFieldErrors(field: string): boolean {
		return !!(this.fieldErrors && this.fieldErrors.find(fe => fe.field === field));
	}

	public throwIfHasErrors() {
		if (this.globalErrors || this.fieldErrors) {
			throw new ValidationErrorDto(this.globalErrors, this.fieldErrors);
		}
	}
}
