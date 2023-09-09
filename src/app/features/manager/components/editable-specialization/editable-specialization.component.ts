import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import {
    MAT_SNACK_BAR_DATA,
    MatSnackBar,
    MatSnackBarRef,
} from '@angular/material/snack-bar';
import { Examination, Specialization } from '@core/models/specialization';
import { SpecializationService } from '@core/services/specialization.service';

@Component({
    selector: 'message-snack-bar-component',
    template: ` <div
        class="d-flex justify-content-between align-items-baseline"
    >
        <span class="message {{ data.class }}">
            {{ data.message }}
        </span>
        <button mat-button (click)="click()" class="btn">OK</button>
    </div>`,
    styles: [
        `
            .btn {
                color: var(--bg-color);
            }
            .message {
                font-weight: 500;
            }
            .beige {
                color: var(--bg-color);
            }
            .primary {
                color: var(--primary);
            }
            .accent {
                color: var(--accent);
            }
            .green {
                color: var(--green);
            }
            .warn {
                color: var(--warn);
            }
        `,
    ],
})
export class MessageSnackBar {
    constructor(
        public snackBarRef: MatSnackBarRef<MessageSnackBar>,
        @Inject(MAT_SNACK_BAR_DATA)
        public data: {
            class: 'primary' | 'accent' | 'green' | 'warn' | 'beige';
            message: string;
        } = {
            class: 'primary',
            message: 'Message',
        }
    ) {}
    click() {
        this.snackBarRef.dismiss();
    }
}

@Component({
    selector: 'app-editable-specialization[specialization]',
    templateUrl: './editable-specialization.component.html',
    styleUrls: ['./editable-specialization.component.css'],
})
export class EditableSpecializationComponent implements OnInit {
    _specialization?: Specialization;
    @Input() set specialization(value: Specialization) {
        this._specialization = value;
    }
    get specialization(): Specialization {
        return this._specialization ?? ({} as Specialization);
    }
    @Output() specializationChange = new EventEmitter<Specialization>();

    get examinations() {
        return this._specialization?.examinations ?? [];
    }

    // Header rows for table
    headerRows = ['name', 'price', 'duration', 'actions'];

    editing = false;
    editingIndex = -1;
    initialValue: Partial<Examination> = {
        name: '',
        price: 0,
        duration: 30,
    };

    startEdit(index: number) {
        this.editing = true;
        this.editingIndex = index;
        this.initialValue = { ...this.examinations[index] };
    }

    @ViewChild('examForm') examForm?: NgForm;

    saveEdit(event: SubmitEvent) {
        const editedExam = this.examinations[this.editingIndex];
        editedExam.duration ??= 30;
        this.specializationsService.update_examination(editedExam).subscribe({
            next: this.handleExaminationUpdated.bind(this, this.editingIndex),
            error: this.handleActionFailed.bind(
                this,
                this.editingIndex,
                'edit'
            ),
            complete: this.stopEditing.bind(this),
        });
    }

    handleExaminationUpdated(index: number, event: Examination) {
        console.log(event);
        this.examinations.splice(index, 1, event);
        this.specializationChange.emit({
            ...(this.specialization ?? ({} as Specialization)),
            examinations: [...this.examinations],
        });
        this._snackBar.openFromComponent(MessageSnackBar, {
            duration: 2000,
            politeness: 'polite',
            data: {
                class: 'green',
                message: 'Examination updated',
            },
        });
    }

    handleActionFailed(index: number, type: string, event: any) {
        let message: string;
        if (type === 'edit') {
            this.examinations[index] = {
                ...this.examinations[index],
                ...this.initialValue,
            };
            message = 'Examination update failed';
        } else {
            message = 'Examination delete failed';
        }
        this._snackBar.openFromComponent(MessageSnackBar, {
            duration: 2000,
            politeness: 'polite',
            data: {
                class: 'warn',
                message: message,
            },
        });
    }

    cancelEdit(index: number) {
        this.examForm?.control.reset(this.initialValue);
        this.stopEditing();
    }

    private stopEditing() {
        this.editing = false;
        this.editingIndex = -1;
    }

    deleteExam(index: number) {
        this.specializationsService
            .delete_examination(this.examinations[index].id)
            .subscribe({
                next: this.handleExaminationDeleted.bind(this, index),
                error: this.handleActionFailed.bind(this, index, 'delete'),
            });
    }

    handleExaminationDeleted(index: number) {
        this.examinations.splice(index, 1);
        this.specializationChange.emit({
            ...(this.specialization ?? ({} as Specialization)),
            examinations: [...this.examinations],
        });
        this._snackBar.openFromComponent(MessageSnackBar, {
            duration: 2000,
            politeness: 'polite',
            data: {
                class: 'green',
                message: 'Examination deleted',
            },
        });
    }

    constructor(
        private specializationsService: SpecializationService,
        private _snackBar: MatSnackBar
    ) {}

    newExamInitial: Partial<Examination> = {
        name: '',
        price: 0,
        duration: 30,
    };

    newExam: Partial<Examination> = { ...this.newExamInitial };

    @ViewChild('addExamForm') addExamForm?: NgForm;
    addExam() {
        const newExam = {
            ...this.newExam,
            duration: 30,
        } as Required<Omit<Examination, 'status'>>;
        this.specializationsService
            .add_examination(this.specialization.id, {
                ...newExam,
                status: 'active',
            })
            .subscribe({
                next: this.handleNewExamAdded.bind(this),
                error: this.handleNewExamFailed.bind(this),
            });
    }

    resetAddExam() {
        this.addExamForm?.reset(this.newExamInitial);
    }

    handleNewExamAdded(event: Examination) {
        this.examinations.push(event);
        this.specializationChange.emit({
            ...(this.specialization ?? ({} as Specialization)),
            examinations: [...this.examinations],
        });
        this._snackBar.openFromComponent(MessageSnackBar, {
            duration: 2000,
            politeness: 'polite',
            data: {
                class: 'green',
                message: `Examination added to ${this.specialization?.name}`,
            },
        });
        this.newExam = { ...this.newExamInitial };
    }
    handleNewExamFailed(event: any) {
        this._snackBar.openFromComponent(MessageSnackBar, {
            duration: 2000,
            politeness: 'polite',
            data: {
                class: 'warn',
                message: `Failed to add examination to ${this.specialization?.name}`,
            },
        });
    }

    ngOnInit(): void {}
}
