import {
    Directive,
    Input,
    Output,
    EventEmitter,
    HostBinding,
    HostListener,
} from '@angular/core';

@Directive({ selector: '[hold]' })
export class HoldDirective {
    @Input() duration: number = 500;

    @Output() onhold: EventEmitter<any> = new EventEmitter();
    @Output() onholding: EventEmitter<any> = new EventEmitter();
    @Output() onholdend: EventEmitter<any> = new EventEmitter();

    private pressing: boolean = false;
    private holding: boolean = false;
    private timeout: any;
    private mouseX: number = 0;
    private mouseY: number = 0;

    @HostBinding('class.press')
    get press() {
        return this.pressing;
    }

    @HostBinding('class.hold')
    get hold() {
        return this.holding;
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        // don't do right/middle clicks
        if (event.which !== 1) return;

        this.mouseX = event.clientX;
        this.mouseY = event.clientY;

        this.pressing = true;
        this.holding = false;

        this.timeout = setTimeout(() => {
            this.holding = true;
            this.onhold.emit(event);
            this.loop(event);
        }, this.duration);

        this.loop(event);
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (this.pressing && !this.holding) {
            const xThres = event.clientX - this.mouseX > 10;
            const yThres = event.clientY - this.mouseY > 10;
            if (xThres || yThres) {
                this.endPress();
            }
        }
    }

    loop(event: Event) {
        if (this.holding) {
            this.timeout = setTimeout(() => {
                this.onholding.emit(event);
                this.loop(event);
            }, 50);
        }
    }

    endPress() {
        clearTimeout(this.timeout);
        this.holding = false;
        this.pressing = false;
        this.onholdend.emit(true);
    }

    @HostListener('mouseup')
    onMouseUp() {
        this.endPress();
    }
}
