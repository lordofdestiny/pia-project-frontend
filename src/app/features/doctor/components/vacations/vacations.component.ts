import {
    Component,
    OnInit,
    OnDestroy,
    Inject,
    ViewEncapsulation,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroupDirective, Validators } from "@angular/forms";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
    MatDateFormats,
} from "@angular/material/core";
import {
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    MomentDateAdapter,
} from "@angular/material-moment-adapter";
import { MatCalendar, MatCalendarCellClassFunction } from "@angular/material/datepicker";

import { Doctor } from "@core/models/users";
import { AuthService } from "@core/services/auth.service";

import { Subject, takeUntil } from "rxjs";
import { MY_FORMATS } from "src/app/app.module";
import { IsHandsetService } from "@core/services/is-handset.service";
import { DoctorService } from "@core/services/doctor.service";
import { moment } from "@core/utils/moment";

@Component({
    selector: "app-vacations",
    templateUrl: "./vacations.component.html",
    styleUrls: ["./vacations.component.css"],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    encapsulation: ViewEncapsulation.Emulated,
})
export class VacationsComponent implements OnInit {
    minDate = moment().add(1, "days").toDate();
    datepickerHeader = DatepickerHeader;

    vacations =
        (this.authService.user as Doctor)?.vacations?.filter(({ end_date }) =>
            moment(end_date).isAfter(moment(), "days")
        ) ?? [];
    get initialDate() {
        return moment(this.vacations[this.vacations.length - 1]?.end_date)
            .add(1, "days")
            .toDate();
    }

    dateRange = this.fb.group({
        start: [{ value: this.initialDate, disabled: false }, Validators.required],
        end: [{ value: this.initialDate, disabled: false }, Validators.required],
    });
    myFilter = (date: Date | null): boolean => {
        return !this.vacations.some((vacation) => {
            return moment(date).isBetween(vacation.start_date, vacation.end_date, "days", "[]");
        });
    };
    dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
        if (view !== "month") {
            return "";
        }
        const highligh = this.vacations.some((vacation) =>
            moment(cellDate).isBetween(vacation.start_date, vacation.end_date, "days", "[]")
        );
        if (moment(cellDate).isBefore(moment(), "days")) {
            return "before-today";
        }

        return highligh ? "vacation-days" : "";
    };

    constructor(
        public isHandsetService: IsHandsetService,
        private fb: FormBuilder,
        private authService: AuthService,
        private doctorsService: DoctorService
    ) {}

    isHandset$ = this.isHandsetService.isHandset$;

    sorted(array: { start_date: Date; end_date: Date }[]) {
        return array
            .slice()
            .sort(({ start_date: a }, { start_date: b }) => (moment(a).isBefore(b) ? -1 : 1))
            .filter(({ end_date }) => moment(end_date).isAfter(moment(), "days"));
    }

    ngOnInit(): void {}

    @ViewChild(FormGroupDirective) private formDirective!: FormGroupDirective;
    handleSubmit() {
        const { start, end } = this.dateRange.value;
        this.doctorsService
            .add_vacation(this.authService.user.id, {
                start_date: start!,
                end_date: end!,
            })
            .subscribe({
                next: (vacations) => {
                    this.vacations = vacations;
                },
                error: (err) => console.error(err),
                complete: () => {
                    this?.formDirective?.resetForm({
                        start: this.initialDate,
                        end: this.initialDate,
                    });
                },
            });
    }
}

@Component({
    selector: "header",
    template: `
        <div class="header">
            <button
                mat-icon-button
                class="double-arrow"
                (click)="previousClicked('year')">
                <mat-icon>keyboard_arrow_left</mat-icon>
                <mat-icon>keyboard_arrow_left</mat-icon>
            </button>
            <button
                mat-icon-button
                (click)="previousClicked('month')">
                <mat-icon>keyboard_arrow_left</mat-icon>
            </button>
            <span class="header-label">{{ periodLabel }}</span>
            <button
                mat-icon-button
                (click)="nextClicked('month')">
                <mat-icon>keyboard_arrow_right</mat-icon>
            </button>
            <button
                mat-icon-button
                class="double-arrow"
                (click)="nextClicked('year')">
                <mat-icon>keyboard_arrow_right</mat-icon>
                <mat-icon>keyboard_arrow_right</mat-icon>
            </button>
        </div>
    `,
    styles: [
        `
            .header {
                display: flex;
                align-items: center;
                padding: 0.5em;
            }

            .header-label {
                flex: 1;
                height: 1em;
                font-weight: 500;
                text-align: center;
            }

            .double-arrow .mat-icon {
                margin: -22%;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerHeader<D> implements OnDestroy {
    private _destroyed = new Subject<void>();

    constructor(
        private _calendar: MatCalendar<D>,
        private _dateAdapter: DateAdapter<D>,
        @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
        cdr: ChangeDetectorRef
    ) {
        _calendar.stateChanges
            .pipe(takeUntil(this._destroyed))
            .subscribe(cdr.markForCheck.bind(cdr));
    }

    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
    }

    get periodLabel() {
        return this._dateAdapter
            .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
            .toLocaleUpperCase();
    }

    previousClicked(mode: "month" | "year") {
        this.handlePositionUpdate(mode, -1);
    }

    nextClicked(mode: "month" | "year") {
        this.handlePositionUpdate(mode, 1);
    }

    handlePositionUpdate(mode: "month" | "year", amount: number) {
        const args: [D, number] = [this._calendar.activeDate, amount];
        this._calendar.activeDate =
            mode === "month"
                ? this._dateAdapter.addCalendarMonths(...args)
                : this._dateAdapter.addCalendarYears(...args);
    }
}
