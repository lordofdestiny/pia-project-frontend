export interface DoctorListDataItem {
    first_name: string;
    last_name: string;
    specialization: string;
    profile_picture: string;
    username?: string;
}

export type DoctorListData = DoctorListDataItem[];
