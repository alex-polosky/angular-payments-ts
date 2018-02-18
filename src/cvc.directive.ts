import { Directive, ElementRef, forwardRef } from "@angular/core";
import { NG_VALIDATORS } from "@angular/forms";
import { AbstractInputDirective } from "./input.directive";
import { Cards, CardFormat } from "./cards";

const selector: string = '[payments-cvc]';

@Directive({
    selector: selector,
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => AngularPaymentsCVCDirective), multi: true }
    ]
})
export class AngularPaymentsCVCDirective extends AbstractInputDirective {

    constructor(el: ElementRef) {
        super(el);
    }

    public validate(): { [key: string]: any } {
        let value = this._elementValue;
        let valid = true;
        let issue = { }
        issue[selector] = false;

        if (!value) {
            return null;
        }

        if (!/^\d+$/.test(value)) {
            return issue;
        }

        let card = this._elementCardType;
        
        if (card) {
            if (value.length !== length) {
                return issue;
            }
        }
        else {
            if (value.length !== 3 && value.length !== 4) {
                return issue;
            }
        }

        return null;
    }

    protected _ngAfterViewInit() {
        
    }

    protected _restrict(e: KeyboardEvent) {
        
    }

    protected _format(e: KeyboardEvent) {
        // Catch delete, tab, backspace, arrows, etc..
        if (e.which === 8 || e.which === 0) {
            return;
        }

        if (this._isInvalidKey(e)) {
            e.preventDefault();
            return;
        }

        if (this._hasTextSelected()) {
            return;
        }

        let value = this._elementValue + e.key;

        let card = this._elementCardType;
        let length = card != null ? card.cvcLength : 4;

        if (value.length <= length) {
            return;
        }
        else {
            e.preventDefault();
            return;
        }
    }

    protected _formatBack(e: KeyboardEvent) {

    }

    protected _reFormat(e: KeyboardEvent) {

    }

}