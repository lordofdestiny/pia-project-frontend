import { Pipe, PipeTransform } from '@angular/core';
import { isObservable, Observable, tap } from 'rxjs';

const print = (message: string | null | undefined) =>
    message
        ? (value: any) => console.log(message, value)
        : (value: any) => console.log(value);

@Pipe({
    name: 'debug',
    pure: true,
})
export class DebugPipe implements PipeTransform {
    transform(value: any, msg?: string, ..._args: any[]) {
        if (isObservable(value)) {
            return value.pipe(tap(print(msg)));
        } else {
            print(msg)(value);
            return value;
        }
    }
}
