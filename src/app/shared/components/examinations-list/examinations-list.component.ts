import { Component, ContentChild, Directive, Input, OnInit, TemplateRef } from "@angular/core";
import { Examination } from "@core/models/specialization";

@Directive({
    selector: "[examListBtns]",
})
export class ExaminationsListButtonsDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
    selector: "app-examinations-list",
    templateUrl: "./examinations-list.component.html",
    styleUrls: ["./examinations-list.component.css"],
})
export class ExaminationsListComponent implements OnInit {
    headerRows = ["name", "duration", "price", "btns"];
    @Input() set disabled(value: boolean) {
        if (value) {
            this.headerRows = ["name", "duration", "price"];
        } else {
            this.headerRows = ["name", "duration", "price", "btns"];
        }
    }
    @Input() examinations: Examination[] = [];
    @Input() noDataMessage = "No examinations to show";

    @ContentChild(ExaminationsListButtonsDirective)
    buttons!: ExaminationsListButtonsDirective;

    constructor() {}

    ngOnInit(): void {}
}
