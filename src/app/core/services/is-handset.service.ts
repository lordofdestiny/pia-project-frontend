import { Injectable } from '@angular/core';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
    providedIn: 'any',
})
export class IsHandsetService {
    constructor(private breakpointObserver: BreakpointObserver) {}

    get isHandset$(): Observable<boolean> {
        return this.breakpointObserver.observe(Breakpoints.Handset).pipe(
            map((result) => result.matches),
            shareReplay()
        );
    }
}
