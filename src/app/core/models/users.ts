import { Examination, Specialization } from './specialization';

export type UserRole = 'patient' | 'doctor' | 'manager';

export interface UserBase {
    id: string;
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

export type User = Patient | Doctor | Manager;
export type Patient = UserBase & {
    type: 'patient';
    status: 'created' | 'active' | 'deleted';
};

export type Doctor = UserBase & {
    type: 'doctor';
    specialization: Specialization;
    examinations: Examination[];
    examination_requests: Examination[];
    licence_number: string;
    branch: string;
};

export type Manager = UserBase & {
    type: 'manager';
};

export type UserCredentials = Pick<User, 'username' | 'password'>;
