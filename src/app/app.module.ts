import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '@core/core.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LandingModule } from '@features/landing/landing.module';
import { NavigationEnd, Router } from '@angular/router';

@NgModule({
    declarations: [AppComponent],
    providers: [],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CoreModule,
        LandingModule,
    ],
    exports: [],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(private router: Router) {}
}
