export interface NewAppointment {
    doctorId: string;
    patientId: string;
    examinationId: string;
    datetime: Date;
}

export interface AppointmentReport {
    reason: string;
    diagnosis: string;
    therapy: string;
    followup: Date | string;
}

export type AppointmentType = "patient" | "doctor";

export interface AppointmentBase<T extends AppointmentType> {
    id: string;
    examination: {
        id: string;
        name: string;
        duration: number;
    };
    datetime: Date;
    report: AppointmentReport | null;
}

export interface AppointmentPatient extends AppointmentBase<"patient"> {
    id: string;
    doctor: {
        id: string;
        first_name: string;
        last_name: string;
        branch: string;
        specialization: {
            id: string;
            name: string;
        };
    };
    patient: string;
    reportUrl?: string;
}

export interface AppointmentDoctor extends AppointmentBase<"doctor"> {
    id: string;
    doctor: string;
    patient: {
        id: string;
        first_name: string;
        last_name: string;
    };
}
