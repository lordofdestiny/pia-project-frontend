import { Injectable } from '@angular/core';

import { ErrorMessage } from '@shared/components/mat-err-msgs/mat-err-msgs.component';

@Injectable({
    providedIn: 'any',
})
export class FieldErrorMessagesService {
    [key: string]: any;

    get first_name(): ErrorMessage[] {
        return [
            {
                name: 'required',
                message: 'First name is required',
            },
        ];
    }

    get last_name(): ErrorMessage[] {
        return [
            {
                name: 'required',
                message: 'Last name is required',
            },
        ];
    }

    get email(): ErrorMessage[] {
        return [
            {
                name: 'required',
                message: 'Email is required',
            },
            {
                name: 'pattern',
                message: 'Email format is not valid',
            },
            {
                name: 'notuniqueEmail',
                message: 'Email is already taken',
            },
        ];
    }

    get username(): ErrorMessage[] {
        return [
            {
                name: 'required',
                message: 'Username is required',
            },
            {
                name: 'minlength',
                message: 'Username must be at least 4 characters long',
            },
            {
                name: 'maxlength',
                message: 'Username must be at most 20 characters long',
            },
            {
                name: 'pattern',
                message: 'Username format is not valid',
            },
            {
                name: 'notuniqueUsername',
                message: 'Username is already taken',
            },
        ];
    }

    get phone(): ErrorMessage[] {
        return [
            {
                name: 'required',
                message: 'Phone is required',
            },
            {
                name: 'pattern',
                message: 'Phone format is not valid',
            },
        ];
    }

    get address(): ErrorMessage[] {
        return [
            {
                name: 'required',
                message: 'Address is required',
            },
        ];
    }

    get password(): ErrorMessage[] {
        return [
            {
                name: 'required',
                message: 'Password is required',
            },
            {
                name: 'minlength',
                message: 'Password must be at least 8 characters long',
            },
            {
                name: 'maxlength',
                message: 'Password must be at most 14 characters long',
            },
            {
                name: 'pattern',
                message: 'Password format is not valid',
            },
        ];
    }

    get profile_picture(): ErrorMessage[] {
        return [
            {
                name: 'tooSmall',
                message: 'Image has to be at least 100px \xD7 100px',
            },
            {
                name: 'tooBig',
                message: 'Image has to be at most 300px \xD7 300px',
            },
            {
                name: 'notImage',
                message: 'File is not an image',
            },
        ];
    }
}
