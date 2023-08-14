import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './components/welcome.component';

@NgModule({
  declarations: [WelcomeComponent],
  imports: [CommonModule, WelcomeRoutingModule],
  bootstrap: [WelcomeComponent],
  exports: [WelcomeComponent],
})
export class WelcomeModule {}
