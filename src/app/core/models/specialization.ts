export type Examination = {
    id: string;
    name: string;
    duration: number;
    price: number;
    disabled: boolean;
};

export interface Specialization {
    id: string;
    name: string;
    examinations: Examination[];
}