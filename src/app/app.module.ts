import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeModule } from './features/welcome/welcome.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';

@NgModule({
    declarations: [AppComponent],
    providers: [],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        WelcomeModule,
        CoreModule,
    ],
    bootstrap: [AppComponent],
    exports: [],
})
export class AppModule {}
