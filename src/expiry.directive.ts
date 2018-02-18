import { Directive, ElementRef, forwardRef } from "@angular/core";
import { AbstractInputDirective } from "./input.directive";
import { AbstractControl, NG_VALIDATORS } from "@angular/forms";
import { Cards } from "./cards";

const selector: string = '[payments-expiry]';

@Directive({
    selector: selector,
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => AngularPaymentsExpiryDirective), multi: true }
    ]
})
export class AngularPaymentsExpiryDirective extends AbstractInputDirective {

    constructor(el: ElementRef) {
        super(el);
    }

    public validate(c: AbstractControl): { [key: string]: any } {
        let value = this._elementValue;
        let valid = true;
        let issue = { }
        issue[selector] = false;

        if (!value) {
            return null;
        }

        let expiryAsString = Cards.parseExpiryAsString(this._elementValue);
        let month = expiryAsString.month;
        let year = expiryAsString.year;

        if (!(month && year)) {
            return issue;
        }

        if (!/^\d+$/.test(month)) {
           return issue;
        }

        if (!/^\d+$/.test(year)) {
            return issue;
        }

        if (parseInt(month, 10) > 12) {
            return issue;
        }

        if (year.length === 2) {
            let prefix = (new Date())
                .getFullYear()
                .toString()
                .slice(0, 2);
            year = prefix + year;
        }

        let expiry = Cards.parseExpiry({
            month: month,
            year: year
        });
        let expiryDate = new Date(expiry.year, expiry.month);

        let currentTime = new Date();
        
        if (expiryDate <= currentTime) {
            return issue;
        }

        if (c.value != expiry) {
            if (typeof(c.value) === 'string') {
                c.setValue(expiry, {
                    emitModelToViewChange: false
                });
            }
            else if ('month' in c.value && 'year' in c.value) {
                if (c.value.month != expiry.month && c.value.year != expiry.year) {
                    c.setValue(expiry, {
                        emitModelToViewChange: false
                    });
                }
            }
        }

        return null;
    }

    protected _ngAfterViewInit() {
        this._element.addEventListener('keypress', this._formatForwardSlash.bind(this));
    }

    protected _restrict(e: KeyboardEvent) {
        if (this._isInvalidKey(e)) {
            e.preventDefault();
            return;
        }

        if (this._hasTextSelected()) {
            return;
        }

        let digit = e.key;
        let value = this._elementValue.replace(/\D/g, '');

        if (value.length >= 6) {
            e.preventDefault();
            return;
        }
    }

    protected _format(e: KeyboardEvent) {
        if (this._isInvalidKey(e)) {
            e.preventDefault();
            return;
        }

        let digit = e.key;
        let value = this._elementValue;

        if (/^\d$/.test(value) && (value !== '0' && value !== '1')) {
            e.preventDefault();
            this._elementValue = "0" + value + " / " + digit;
        }
        else if (/^\d\d$/.test(value)) {
            e.preventDefault();
            this._elementValue = "" + value + " / " + digit;
        }
    }

    protected _formatForwardSlash(e: KeyboardEvent) {
        let key = e.key;
        if (key !== '/') {
            return;
        }

        let value = this._elementValue;
        
        if (/^\d{1,2}$/.test(value)) {
            if (value !== '0') {
                if (value.length === 1) {
                    value = "0" + value;
                }
                this._elementValue = value + " / ";
                return;
            }
        }

        e.preventDefault();
    }

    protected _formatBack(e: KeyboardEvent) {
        if (e.metaKey) {
            return;
        }

        if (e.which !== 8) {
            return;
        }

        let value = this._elementValue;
        if (this.__checkSelectionValueLength(value)) {
            return;
        }

        let slashCheck = /\d(\s|\/)+$/;

        if (slashCheck.test(value)) {
            e.preventDefault();
            this._elementValue = value.replace(slashCheck, '');
        }
    }

    protected _reFormat(e: KeyboardEvent) { }

    private __checkSelectionValueLength(value: string): boolean {
        // I'm not sure what this actually does x.x
        if (!this._elementInput) {
            return false;
        }
        return this._elementInput.selectionStart !== null && this._elementInput.selectionStart !== value.length;
    }

}