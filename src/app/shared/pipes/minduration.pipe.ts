import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'minduration',
})
export class MindurationPipe implements PipeTransform {
    transform(minutes: number, ...args: unknown[]): unknown {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) {
            return `${mins}min`;
        }
        return `${hours} h and ${mins > 10 ? mins : '0' + mins} min`;
    }
}
