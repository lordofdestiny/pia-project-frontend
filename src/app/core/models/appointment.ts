export interface NewAppointment {
    doctorId: string;
    patientId: string;
    examinationId: string;
    datetime: Date;
}

export interface AppointmentReport {}

export interface AppointmentPatient {
    id: string;
    doctor: {
        id: string;
        first_name: string;
        last_name: string;
        branch: string;
    };
    examination: {
        id: string;
        name: string;
    };
    patient: string;
    datetime: Date;
    report: AppointmentReport | null;
    status: "upcoming" | "cancelled_patient" | "cancelled_doctor" | "completed";
}
