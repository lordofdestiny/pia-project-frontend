import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Examination } from '@core/models/specialization';
import { Doctor } from '@core/models/users';

@Component({
    selector: 'app-pick-examinations',
    templateUrl: './pick-examinations.component.html',
    styleUrls: ['./pick-examinations.component.css'],
})
export class PickExaminationsComponent implements OnInit {
    currentExaminations: Examination[] = [];
    availableExaminations: Examination[] = [];
    initialCurrentExaminations: Examination[] = [];
    initialAvailableExaminations: Examination[] = [];

    @Input() set examinations({
        examinations,
        specialization,
    }: Pick<Doctor, 'examinations' | 'specialization'>) {
        this.currentExaminations = examinations ?? [];
        this.availableExaminations = specialization?.examinations?.filter(
            ({ id }) => !examinations?.some((e) => e.id === id)
        ) ??[];
        this.initialCurrentExaminations = [...this.currentExaminations];
        this.initialAvailableExaminations = [...this.availableExaminations];
    }
    @Output() save = new EventEmitter<Examination[]>();
    constructor() {}

    editing = false;
    disabled = false;

    private sameMembers(first: Examination[], second: Examination[]) {
        const set1 = new Set(first);
        const set2 = new Set(second);
        return (
            first.every((item) => set2.has(item)) &&
            second.every((item) => set1.has(item))
        );
    }

    get edited() {
        return (
            this.sameMembers(
                this.currentExaminations,
                this.initialCurrentExaminations
            ) &&
            this.sameMembers(
                this.availableExaminations,
                this.initialAvailableExaminations
            )
        );
    }

    startEditing() {
        this.editing = true;
    }

    cancelEditing() {
        this.currentExaminations = [...this.initialCurrentExaminations];
        this.availableExaminations = [...this.initialAvailableExaminations];
        this.editing = false;
    }

    protected handleRenounce(examination: Examination) {
        this.currentExaminations = this.currentExaminations.filter(
            ({ id }) => id !== examination.id
        );
        this.availableExaminations = [
            ...this.availableExaminations,
            examination,
        ];
    }

    protected handleRecover(examination: Examination) {
        this.currentExaminations = [...this.currentExaminations, examination];
        this.availableExaminations = this.availableExaminations.filter(
            ({ id }) => id !== examination.id
        );
    }

    protected handlePick(examination: Examination) {
        this.availableExaminations = this.availableExaminations.filter(
            ({ id }) => id !== examination.id
        );
        this.currentExaminations = [...this.currentExaminations, examination];
    }

    protected handleSave() {
        this.save.emit(this.currentExaminations);
        this.disabled = true;
    }

    confirmSave() {
        this.initialCurrentExaminations = [...this.currentExaminations];
        this.initialAvailableExaminations = [...this.availableExaminations];
        this.editing = false;
        this.disabled = false;
    }

    rejectSave() {
        this.cancelEditing();
        this.disabled = false;
    }

    ngOnInit(): void {}
}
