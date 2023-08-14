import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponentsModule } from './components/components.core.module';
import { CoreServicesModule } from './services/services.core.module';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [CoreComponentsModule, CoreServicesModule],
})
export class CoreModule {}
