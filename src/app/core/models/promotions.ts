export interface Promotion {
    id: string;
    message: string;
    start: Date;
    end: Date;
}

export interface Notification {
    notification: Promotion;
    seen: boolean;
}
