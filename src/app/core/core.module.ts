import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponentsModule } from './components/components.core.module';
import { SharedModule } from '../shared/shared.module';

import '@utils/array';
import '@utils/string';

@NgModule({
    declarations: [],
    imports: [CommonModule, SharedModule],
    exports: [CoreComponentsModule],
})
export class CoreModule {}
