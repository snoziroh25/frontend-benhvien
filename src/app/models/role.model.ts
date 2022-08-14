export class RoleModel {
    data!: Role[];
    success!: boolean;
    message?: string;
}

export class Role {
    id!: string;
    title!: string;
}