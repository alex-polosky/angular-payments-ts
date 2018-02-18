import { Directive, ElementRef, AfterViewInit } from '@angular/core';
import { Validator, AbstractControl } from '@angular/forms';
import { Cards, CardFormat } from './cards';

export abstract class AbstractInputDirective implements AfterViewInit, Validator {

    // #region Properties

    protected get _element(): any {
        return this.el.nativeElement;
    }

    protected get _elementInput(): HTMLInputElement {
        return this.__getRealElement(this.el.nativeElement);
    }

    protected get _elementValue(): string {
        if ('value' in this._element) {
            return this._element.value;
        }
        else if (this._elementInput && 'value' in this._elementInput) {
            return this._elementInput.value;
        }
        else {
            return null;
        }
    }
    protected set _elementValue(value: string) {
        if ('value' in this._element) {
            this._element.value = value;
        }
        else if (this._elementInput && 'value' in this._elementInput) {
            this._elementInput.value = value;
        }
    }

    protected get _elementCardType(): CardFormat {
        let card: CardFormat;

        let attr = this._element.attributes.getNamedItem('payments-card-type');
        if (attr != null) {
            card = Cards.fromType(attr.value);
        }

        return card;
    }

    // #endregion Properties

    constructor(private el: ElementRef) {
        
    }

    public ngAfterViewInit() {
        this.__setupElement();
        this._ngAfterViewInit();
    }

    public abstract validate(c: AbstractControl):  { [key: string]: any };

    // #region Abstract functions to implement

    protected abstract _restrict(e: KeyboardEvent);
    protected abstract _format(e: KeyboardEvent);
    protected abstract _formatBack(e: KeyboardEvent);
    protected abstract _reFormat(e: KeyboardEvent);
    protected abstract _ngAfterViewInit();

    // #endregion Abstract functions to implement

    // #region Protected utility functions

    protected _hasTextSelected(): boolean {
        if (!this._elementInput) {
            return false;
        }

        if (this._elementInput.selectionStart !== null && this._elementInput.selectionStart !== this._elementInput.selectionEnd) {
            return true;
        }

        // Not sure what this originally did, and as it stands document.selection does not seem to exist
        // if (document.selection) {
        //     return true;
        // }

        return false;
    }

    protected _isInvalidKey(e: KeyboardEvent): boolean {
        let digit = e.key;
        return !/^\d+$/.test(digit) && !e.metaKey && e.charCode !== 0 && !e.ctrlKey;
    }

    // #endregion Protected utility functions

    // #region Private functions

    private __setupElement() {
        this._element.addEventListener('keypress', this._restrict.bind(this));
        this._element.addEventListener('keypress', this._format.bind(this));
        this._element.addEventListener('keydown', this._formatBack.bind(this));
        this._element.addEventListener('paste', this._reFormat.bind(this));
    }

    private __getRealElement(elem: any): any {
        // It's possible that this was attached to an element that contains an input field
        // If so, assume we only care about the first element
        // Note: This is mainly for ion-input when using ionic
        if (elem.nodeName.toLowerCase() !== 'input') {
            let children = elem.childNodes;
            elem = null;
    
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                if (child.nodeName.toLowerCase() === 'input') {
                    elem = child;
                    break;
                }
            }
    
            if (elem == null) {
                console.warn("angular-payments-ts: Element had payments-directive added but no valid target inputs were found");
            }
        }
    
        return elem;
    }

    // #endregion Private functions

}