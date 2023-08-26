import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponentsModule } from '@core/components/components.core.module';
import { SharedModule } from '@shared/shared.module';

import '@core/utils/array';
import '@core/utils/string';

@NgModule({
    declarations: [],
    imports: [CommonModule, SharedModule, CoreComponentsModule],
    exports: [CoreComponentsModule],
})
export class CoreModule {}
