import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SharedObservableService {
    map = new Map<string, Observable<any>>();

    constructor() {}

    create(key: string, observable: Observable<any>) {
        if (this.map.has(key)) {
            throw new Error('Observable already exists');
        }
        this.map.set(key, observable.pipe(finalize(() => this.destroy(key))));
    }

    private destroy(key: string) {
        if (this.map.has(key)) {
            this.map.delete(key);
        }
    }

    get(key: string) {
        if (!this.map.has(key)) {
            throw new Error('Observable does not exist');
        }
        return this.map.get(key);
    }

    has(key: string) {
        return this.map.has(key);
    }
}
