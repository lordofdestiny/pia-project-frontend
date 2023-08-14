import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationComponent } from './navigation.component';

import { WelcomeModule } from 'src/app/features/welcome/welcome.module';

@NgModule({
  declarations: [NavigationComponent],
  imports: [CommonModule, WelcomeModule],
  exports: [NavigationComponent],
})
export class NavigationModule {}
