interface RoleInterface {
    id: number;
    name: string;
}

export interface UserProfileInterface {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    roles: RoleInterface[];
}