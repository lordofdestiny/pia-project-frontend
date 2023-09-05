import { Doctor, Manager, Patient, User } from '@core/models/users';
import { baseUri } from '@environments/environment';

export function resolveProfilePicture<T extends User>(user: T) {
    user.profile_picture = `${baseUri}${user.profile_picture}`;
    return user;
}

export function resolveProfilePictures<T extends User>(users: T[]) {
    users.forEach((user) => {
        resolveProfilePicture(user);
    });
    return users;
}
