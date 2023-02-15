export class ValidateResponse {
    constructor(
        public success: boolean,
        public errorMessage?: string
    ) {}
}