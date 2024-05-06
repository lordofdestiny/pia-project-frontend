import { Doctor, Manager, Patient, User } from '@core/models/users';
import { environment } from '@environments/environment';

export function resolveProfilePicturePath(path: string) {
    return `${environment.baseUri}/${path}`.replace(/\/+/,"/");
}

export function resolveProfilePicture<T extends User>(user: T) {
    user.profile_picture = resolveProfilePicturePath(user.profile_picture);
    return user;
}

export function resolveProfilePictures<T extends User>(users: T[]) {
    users.forEach((user) => {
        resolveProfilePicture(user);
    });
    return users;
}
