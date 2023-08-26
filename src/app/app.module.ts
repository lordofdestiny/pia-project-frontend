import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';

import { CoreModule } from '@core/core.module';
import { LandingModule } from '@features/landing-page/landing.module';
import { LoginPageModule } from '@features/login-page/login-page.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [AppComponent],
    providers: [CookieService],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        LandingModule,
        LoginPageModule,
        CoreModule,
    ],
    bootstrap: [AppComponent],
    exports: [],
})
export class AppModule {
    constructor() {}
}
