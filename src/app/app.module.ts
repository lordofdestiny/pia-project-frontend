import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '@core/core.module';
import { LandingModule } from '@features/landing-page/landing.module';
import { LoginPageModule } from '@features/login-page/login-page.module';
import { RegisterPageModule } from '@features/register-page/register-page.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [AppComponent],
    providers: [],
    imports: [
        CoreModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        LandingModule,
        LoginPageModule,
        RegisterPageModule,
    ],
    exports: [],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {}
}
