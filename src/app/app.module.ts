import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '@core/core.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ChangePasswordModule } from '@features/change-password/change-password.module';

@NgModule({
    declarations: [AppComponent],
    providers: [],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CoreModule,
        ChangePasswordModule,
    ],
    exports: [],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {}
}
