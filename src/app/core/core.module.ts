import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponentsModule } from './components/components.core.module';
import { CoreServicesModule } from './services/services.core.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import '@utils/array';

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [CoreComponentsModule, CoreServicesModule],
})
export class CoreModule {}
