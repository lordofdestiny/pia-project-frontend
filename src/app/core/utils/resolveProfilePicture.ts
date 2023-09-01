import { User } from '@core/models/users';
import { baseUri } from '@environments/environment';

export function resolveProfilePicture(user: User): void {
    user.profile_picture = `${baseUri}${user.profile_picture}`;
}

export function resolveProfilePictures(users: User[]): void {
    users.forEach((user) => {
        resolveProfilePicture(user);
    });
}
