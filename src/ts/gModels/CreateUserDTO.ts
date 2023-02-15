export class CreateUserDTO {
    constructor(
        public name: string,
        public birthday: Date,
        public email: string,
        public password: string
    ) {}
}