import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularPaymentsCardDirective, AngularPaymentsExpiryDirective, AngularPaymentsCVCDirective } from './angular-payments.directive';
import { CreditCardFormComponent } from './forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule
    ],
    exports: [
        AngularPaymentsCardDirective,
        AngularPaymentsExpiryDirective,
        AngularPaymentsCVCDirective,
        CreditCardFormComponent
    ],
    declarations: [
        AngularPaymentsCardDirective,
        AngularPaymentsExpiryDirective,
        AngularPaymentsCVCDirective,
        CreditCardFormComponent
    ],
    providers: []
})
export class AngularPaymentsModule { }