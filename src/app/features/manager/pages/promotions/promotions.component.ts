import { Component, OnInit } from "@angular/core";
import { NgForm, NgModel } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Promotion } from "@core/models/notifications";
import { IsHandsetService } from "@core/services/is-handset.service";
import { PromotionsService } from "@core/services/promotions.service";
import { ActionResultDialogComponent } from "@shared/components/action-success-dialog/action-success-dialog.component";
import moment from "moment";

@Component({
    selector: "app-promotions",
    templateUrl: "./promotions.component.html",
    styleUrls: ["./promotions.component.css"],
})
export class PromotionsComponent implements OnInit {
    promotions: Promotion[] = this.route.snapshot.data["promotions"];

    promotionSort = (a: Promotion, b: Promotion) => {
        const diff = moment(b.start).valueOf() - moment(a.start).valueOf();
        if (diff !== 0) {
            return diff;
        }
        return moment(b.end).valueOf() - moment(a.end).valueOf();
    };

    constructor(
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private isHandsetService: IsHandsetService,
        private promotionsService: PromotionsService
    ) {
        this.promotions.sort((a, b) => moment(b.start).valueOf() - moment(a.start).valueOf());
    }

    isHandset$ = this.isHandsetService.isHandset$;

    newPromotion = {
        message: "",
        dates: [new Date(), new Date()],
    };

    addPromotion(form: NgForm) {
        const promotion: Omit<Promotion, "id"> = {
            message: form.value.message,
            start: form.value.dates[0],
            end: form.value.dates[1],
        };
        this.promotionsService.add_promotion(promotion).subscribe({
            next: this.handlePromotionAdded.bind(this, form),
            error: this.handlePromotionAddedError.bind(this),
        });
    }

    handlePromotionAdded(form: NgForm, promotion: Promotion) {
        this.promotions = [...this.promotions, promotion];
        this.dialog.open(ActionResultDialogComponent, {
            panelClass: "dialog-color",
            data: {
                success: true,
                message: "Promotion added",
            },
        });
        form.resetForm();
    }

    handlePromotionAddedError(error: any) {
        this.dialog.open(ActionResultDialogComponent, {
            panelClass: "dialog-color",
            data: {
                success: false,
                message: "Error adding promotion",
            },
        });
    }

    ngOnInit(): void {}
}
