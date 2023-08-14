import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeModule } from 'src/app/features/welcome/welcome.module';

import { ThemeService } from 'src/app/core/services/theme.service';

import { NavigationComponent } from './navigation.component';

import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';

import {} from 'primeng/menubar';
@NgModule({
    declarations: [NavigationComponent],
    providers: [ThemeService],
    imports: [CommonModule, WelcomeModule, MenubarModule, InputTextModule],
    exports: [NavigationComponent],
})
export class NavigationModule {}
