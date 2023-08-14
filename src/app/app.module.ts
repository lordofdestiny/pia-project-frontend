import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeModule } from './features/welcome/welcome.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import {
    NavbarModule,
    DropdownModule,
    NavModule,
    CollapseModule,
    GridModule,
} from '@coreui/angular';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        WelcomeModule,
        CoreModule,
        NavbarModule,
        DropdownModule,
        NavModule,
        CollapseModule,
        GridModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
    exports: [],
})
export class AppModule {}
