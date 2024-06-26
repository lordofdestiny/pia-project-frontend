import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MomentDateModule} from "@angular/material-moment-adapter";

import {CoreModule} from "@core/core.module";

import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {LandingModule} from "@features/landing/landing.module";
import {Router} from "@angular/router";
import {MatSnackBarModule} from "@angular/material/snack-bar";

// Import moment.js
import * as _moment from "moment";
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from "moment";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";

export const MY_FORMATS = {
    parse: {
        dateInput: "DD.MM.YYYY.",
    },
    display: {
        dateInput: "DD.MM.YYYY.",
        monthYearLabel: "MMMM YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "MMMM YYYY",
    },
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MomentDateModule,
        CoreModule,
        LandingModule,
        MatSnackBarModule,
        BsDatepickerModule.forRoot(),
    ],
    exports: [MomentDateModule],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(private router: Router) {
    }
}
