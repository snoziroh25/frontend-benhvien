 export class Account {
    id!: string;
    username!: string ; // ! có nghĩa là bắt buộc phải có
    password!: string ;
    roleId?: string; // ? có nghĩa là có thể null
}
