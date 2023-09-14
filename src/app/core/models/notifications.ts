export type NotificationType = "promotion" | "cancellation" | "appointment";

export interface NotificationContentBase {
    id: string;
    message: string;
    date: Date | string;
    type: NotificationType;
}

export interface NotificationContentPromotion extends NotificationContentBase {
    start: Date | string;
    end: Date | string;
    type: "promotion";
}

export interface NotificationContentCancellation extends NotificationContentBase {
    type: "cancellation";
}

export interface NotificationContentReminder extends NotificationContentBase {
    type: "appointment";
    appointment: string;
}

export type NotificationContent = NotificationContentPromotion | NotificationContentCancellation;

export interface Notification {
    notification: NotificationContent;
    seen: boolean;
}

export type Promotion = Omit<NotificationContentPromotion, "id" | "type" | "date">;
