import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@core/models/users';

@Pipe({
    name: 'full_name',
})
export class FullNamePipe implements PipeTransform {
    transform(value: User, ...args: unknown[]): unknown {
        const { first_name, last_name } = value;
        return `${first_name} ${last_name}`;
    }
}
