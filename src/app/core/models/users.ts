export type UserRole = 'patient' | 'doctor' | 'manager';

export interface User {
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
    address: string;
    phone: string;
    type: UserRole;
    profile_picture: string;
    [keyof: string]: any;
}

export interface Patient extends User {}

export interface Doctor extends User {
    specialization: string;
    licence_number: string;
    branch: string;
}

export type UserCredentials = Pick<User, 'username' | 'password'>;
