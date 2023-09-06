import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Examination } from '@core/models/specialization';
import { DoctorExaminations } from '@core/resolvers/examinations.resolver';
import { request } from 'http';

@Component({
    selector: 'app-pick-examinations',
    templateUrl: './pick-examinations.component.html',
    styleUrls: ['./pick-examinations.component.css'],
})
export class PickExaminationsComponent implements OnInit {
    currentExaminations: Examination[] = [];
    requestedExaminations: Examination[] = [];
    availableExaminations: Examination[] = [];
    initialCurrentExaminations: Examination[] = [];
    initialRequestedExaminations: Examination[] = [];
    initialAvailableExaminations: Examination[] = [];

    @Input() set examinations({
        current,
        requested,
        forSpecialization,
    }: DoctorExaminations) {
        this.currentExaminations = current;
        this.requestedExaminations = requested;
        this.availableExaminations = forSpecialization
            .filter(({ id }) => !current.some((e) => e.id === id))
            .filter(({ id }) => !requested.some((e) => e.id === id));
        this.initialCurrentExaminations = [...this.currentExaminations];
        this.initialRequestedExaminations = [...this.requestedExaminations];
        this.initialAvailableExaminations = [...this.availableExaminations];
    }
    @Output() save = new EventEmitter<{
        newOffered: Examination[];
        newRequested: Examination[];
    }>();
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
                this.requestedExaminations,
                this.initialRequestedExaminations
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
        this.requestedExaminations = [...this.initialRequestedExaminations];
        this.availableExaminations = [...this.initialAvailableExaminations];
        this.editing = false;
    }

    protected handleRemove(examination: Examination) {
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

    protected handleSendRequest(examination: Examination) {
        this.availableExaminations = this.availableExaminations.filter(
            ({ id }) => id !== examination.id
        );
        this.requestedExaminations = [
            ...this.requestedExaminations,
            examination,
        ];
    }

    protected handleCancelRequest(examination: Examination) {
        this.requestedExaminations = this.requestedExaminations.filter(
            ({ id }) => id !== examination.id
        );
        this.availableExaminations = [
            ...this.availableExaminations,
            examination,
        ];
    }

    protected handleSave() {
        this.save.emit({
            newOffered: this.currentExaminations,
            newRequested: this.requestedExaminations,
        });
        this.disabled = true;
    }

    confirmSave() {
        console.log('confirming save');
        this.initialCurrentExaminations = [...this.currentExaminations];
        this.initialRequestedExaminations = [...this.requestedExaminations];
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
