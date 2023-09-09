export type NewExamination = {
    name: string;
    duration?: number;
    price: number;
    status: 'requested' | 'active';
};

export type Examination = {
    id: string;
    name: string;
    duration: number;
    price: number;
    status: 'requested' | 'active' | 'inactive';
};

export type ExaminationRequest = {
    specialization: {
        id: string;
        name: string;
    };
} & Examination;

export interface Specialization {
    id: string;
    name: string;
    examinations: Examination[];
}
