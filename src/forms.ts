import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

export class AbstractCreditCardFormComponent {

    @Output('name') name = new EventEmitter<any>();
    @Output('number') number = new EventEmitter<any>();
    @Output('cvc') cvc = new EventEmitter<any>();
    @Output('expiry') expiry = new EventEmitter<any>();
    @Output('status') status = new EventEmitter<any>();
    @Output('form') form = new EventEmitter<FormGroup>();

    public creditCardForm: FormGroup;

    constructor(
        @Inject(FormBuilder) formBuilder: FormBuilder
    ) {
        this.creditCardForm = formBuilder.group({
            name: [ '' ],
            number: [ '' ],
            cvc: [ '' ],
            expiry: [ '' ],
        });

        this.creditCardForm.get('name').valueChanges.subscribe(
            (data) => {
                this.name.emit(data);
            }
        )

        this.creditCardForm.get('number').valueChanges.subscribe(
            (data) => {
                this.number.emit(data);
            }
        )

        this.creditCardForm.get('cvc').valueChanges.subscribe(
            (data) => {
                this.cvc.emit(data);
            }
        )

        this.creditCardForm.get('expiry').valueChanges.subscribe(
            (data) => {
                this.expiry.emit(data);
            }
        )

        this.creditCardForm.statusChanges.subscribe(
            (data) => {
                this.status.emit(data);
            }
        )
        
        setTimeout(() => { 
            this.form.emit(this.creditCardForm); 
        });
    }

    static metaData = {
        outputs: [
            'name',
            'number',
            'cvc',
            'expiry',
            'status',
            'form'
        ]
    }

}

@Component({
    selector: 'payments-credit-card-form',
    templateUrl: 'credit-card-form.component.html',
    outputs: AbstractCreditCardFormComponent.metaData.outputs
})
export class CreditCardFormComponent extends AbstractCreditCardFormComponent {

    constructor(
        @Inject(FormBuilder) formBuilder: FormBuilder
    ) {
        super(formBuilder);
    }

}