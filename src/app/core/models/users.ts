import { AppointmentBase, AppointmentDoctor, AppointmentPatient } from "./appointment";
import { Notification } from "./notifications";
import { Examination, Specialization } from "./specialization";

export type UserRole = "patient" | "doctor" | "manager";

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
    type: "patient";
    appointments?: AppointmentBase<any>[];
    notifications?: Notification[];
    status: "created" | "active" | "deleted";
};

export type Vacation = {
    start_date: Date;
    end_date: Date;
};

export type Doctor = UserBase & {
    type: "doctor";
    specialization: Specialization;
    examinations: Examination[];
    licence_number: string;
    branch: string;
    appointments?: AppointmentBase<any>[];
    vacations?: Vacation[];
};

export type Manager = UserBase & {
    type: "manager";
};

export type UserCredentials = Pick<User, "username" | "password">;
