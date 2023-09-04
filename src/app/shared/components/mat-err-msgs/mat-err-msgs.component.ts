import {
    AfterViewInit,
    Component,
    Injector,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import {
    MatFormField,
    MatFormFieldControl,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

export interface ErrorMessage {
    name: string;
    message: string;
}

@Component({
    selector: '[app-mat-err-msgs]',
    template: '{{error}}',
})
export class MatErrMsgsComponent implements AfterViewInit, OnChanges {
    error: string = 'Invalid input';
    error_messages: ErrorMessage[] = [];
    private inputRef?: MatFormFieldControl<MatInput>;
    @Input() set errors(errors: ErrorMessage[]) {
        this.error_messages = errors;
    }

    constructor(private _inj: Injector) {}

    ngAfterViewInit(): void {
        // grab reference to matformfield directive, where form control is accessible.
        this.inputRef = this._inj.get(MatFormField)._control;

        // sub to the control's status stream
        this.inputRef.ngControl?.statusChanges?.subscribe(
            this.setErrorMessage.bind(this)
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['errors']) {
            if (!changes['errors'].currentValue) {
                this.error_messages = [];
            }
        }
    }

    private setErrorMessage(state: 'valid' | 'invalid') {
        if (state === 'valid') {
            return;
        }
        // active errors on the formcontrol
        const controlerrors = this.inputRef?.ngControl?.errors ?? {};
        if (Object.keys(controlerrors).length === 0) {
            return;
        }
        // just grab one error
        const firsterror = Object.keys(controlerrors)?.[0];

        for (const { name, message } of this.error_messages) {
            if (name === firsterror) {
                this.error = message;
                break;
            }
        }
    }
}
