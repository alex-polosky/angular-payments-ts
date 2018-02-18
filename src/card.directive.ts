import { Directive, ElementRef, forwardRef } from "@angular/core";
import { NG_VALIDATORS, AbstractControl } from "@angular/forms";
import { AbstractInputDirective } from "./input.directive";
import { Cards, CardFormat } from "./cards";

const selector: string = '[payments-card]';

@Directive({
    selector: selector,
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => AngularPaymentsCardDirective), multi: true }
    ]
})
export class AngularPaymentsCardDirective extends AbstractInputDirective {

    constructor(el: ElementRef) {
        super(el);
    }

    public validate(c: AbstractControl): { [key: string]: any } {
        let value = this._elementValue;
        let valid = true;
        let issue = { }
        issue[selector] = false;

        this.__clearCardClass();

        // Empty number is valid (should be handled with a 'required' directive)
        if (!value) {
            return null;
        }

        value = (value + '').replace(/\s+|-/g, '');
        if (c.value != value) {
            c.setValue(value, {
                emitModelToViewChange: false
            });
        }

        if (!/^\d+$/.test(value)) {
            return issue;
        }

        let card = Cards.fromNumber(value);
        
        if (!card) {
            return issue;
        }

        this.__clearCardClass();
        this.__setCardClass(card);

        if (card.luhn && !this.__luhnCheck(value)) {
            return issue;
        }

        let lengthMatch = false;
        for (let i = 0; i < card.length.length; i++) {
            let length = card.length[i];
            if (value.length === length) {
                lengthMatch = true;
            }
        }

        if (!lengthMatch) {
            return issue;
        }

        return null;
    }

    protected _ngAfterViewInit() {

    }

    protected _restrict(e: KeyboardEvent) {

        // Catch delete, tab, backspace, arrows, etc..
        if (e.which === 8 || e.which === 0) {
            return;
        }

        let digit = e.key;

        if(!/^\d+$/.test(digit)) {
            e.preventDefault();
            return;
        }

        if (this._hasTextSelected()) {
            return;
        }

        let value = (this._elementValue + digit).replace(/\D/g, '');
        let card = Cards.fromNumber(value);

        let upperLength = 16;
        if (card) {
            upperLength = card.length[card.length.length - 1];
        }

        if (value.length > upperLength) {
            e.preventDefault();
        }
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

        let value = this._elementValue;

        if (this.__checkSelectionValueLength(value)) {
            return;
        }

        let digit = e.key;

        let card = Cards.fromNumber(value + digit);
        let length = (value.replace(/\D/g, '') + digit).length;

        let re = Cards.defaultInputFormat;
        let upperLength = 16;

        if (card) {
            re = card.inputFormat;
            upperLength = card.length[card.length.length - 1];
        }

        if (length >= upperLength) {
            // Shouldn't we be stopping propogation here?
            return;
        }

        if (re.test(value)) {
            e.preventDefault();
            this._elementValue = value + ' ' + digit;
        }
        else if (re.test(value + digit)) {
            e.preventDefault();
            this._elementValue = value + digit + ' ';
        }
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

        if (/\d\s$/.test(value) && !e.metaKey && e.keyCode >= 46) {
            e.preventDefault();
            this._elementValue = value.replace(/\d\s$/, '');
        }
        else if (/\s\d?$/.test(value)) {
            e.preventDefault();
            this._elementValue = value.replace(/\s\d?$/, '');
        }
    }

    protected _reFormat(e: KeyboardEvent) {
        // I'm not sure why the original code uses setTimeout, but I'm following suit
        setTimeout(function() {
            this._elementValue = this.__getFormattedCardNumber();
        }.bind(this));
    }

    private __getFormattedCardNumber(): string {
        let value = this._elementValue;
        let card = Cards.fromNumber(value);

        if (!card) {
            return this._elementValue;
        }

        let upperLength = card.length[card.length.length - 1];
        value = value.replace(/\D/g, '');
        value = value.slice(0, +upperLength + 1 || 9e9);

        if (card.format.global) {
            let ref = value.match(card.format);
            return ref !== null ? ref.join(' ') : void 0;
        }
        else {
            let groups = card.format.exec(value);

            if (groups !== null) {
                groups.shift();
            }

            return groups !== null ? groups.join(' ') : void 0;
        }
    }

    private __parseCardNumber(): string {
        let value = this._elementValue;
        return value !== null && value !== undefined ? value.replace(/\s/g, '') : value;
    }

    private __checkSelectionValueLength(value: string): boolean {
        // I'm not sure what this actually does x.x
        if (!this._elementInput) {
            return false;
        }
        return this._elementInput.selectionStart !== null && this._elementInput.selectionStart !== value.length;
    }

    private __luhnCheck(value: string): boolean {
        let odd = true;
        let sum = 0;
        let digits = (value + '').split('').reverse();

        for (let i = 0; i < digits.length; i++) {
            let digit = parseInt(digits[i], 10);

            if ((odd = !odd)) {
                digit *= 2;
            }

            if (digit > 9) {
                digit -= 9;
            }

            sum += digit;
        }

        return sum % 10 === 0;
    }

    private __clearCardClass(): void {
        let cards = Cards.cardFormats;
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            this._element.classList.remove('payments-card-' + card.type);
        }
        this.__clearCardAttr();
    }

    private __setCardClass(card: CardFormat): void {
        this._element.classList.add('payments-card-' + card.type);
        this.__setCardAttr(card);
    }

    private __clearCardAttr(): void {
        let elems = document.querySelectorAll('[payments-card-type]');
        for (let i = 0; i < elems.length; i++) {
            let elem = elems[i];
            elem.removeAttribute('payments-card-type');
        }
    }

    private __setCardAttr(card: CardFormat): void {
        let attributes = ['card', 'cvc', 'expiry'];
        for (let attributeName of attributes) {
            let elems = document.querySelectorAll('[payments-' + attributeName + ']');
            for (let i = 0; i < elems.length; i++) {
                let elem = elems[i];
                elem.setAttribute('payments-card-type', card.type);
            }
        }
    }

}