# Angular Payments

An Angular Module that provides directives for *formatting* and *validating* forms related to payments, in addition to an extendable form with pre-built outputs (work in progress).

### Credits

I created this library after trying to utilize the original angular-payments package written by https://github.com/laurihy (https://github.com/laurihy/angular-payments).

I personally wanted to use the package with Ionic, and after much frustration of trying to figure out why I was receiving random errors, I realized that the last update was in approximattely 2015. As such, I determined that it would require a large rewrite, to convert the code over to Typescript and upgrade the angular version. I however did not include the original stripe dependency, as I could not find a way to dynamically check for the existance of the stripe library, and I did not want to make it a strict dependency.

## Installation

To use Angular Payments TS, you have a few options:

* npm
* git
* local pull

### npm

To install using npm, all you have to do from a command line in your project directory is:

	npm install angular-payments-ts --save

### git

To install using npm and git, enter the following in the command line:

	npm install https://github.com/alex-polosky/angular-payments-ts.git --save

### local pull

If for understandable reasons, since this package deals with credit card information, you would like to instead pull down the source files and build the package yourself, you can do so. I created a heap of tools and scripts in npm to be able to make the process relatively straightforward. This guide will assume that you have already created a local folder, initialized git, and pulled down the latest files.

Once the files are downloaded, you'll need to ensure that you have the dev npm dependencies in tsconfig.json installed via either a) --global, to enable direct use from the command line, or b) modify the scripts in package.json to reference the path to the relevant tools.

After that, all you have to do in the command line is:

	npm run prepublish

This command kicks off two other scripts: build and bundle.

Build will run the typescript compiler and rollup compiler targetting both UMD and ES2015(6?), as well as the ngc command to generate AOT metadata. The typescript compiler will generate the required type directive files (along with the actual js), while rollup will bundle all the javascript into one nice file that can be loaded up.

Bundle then takes the type definition files generated from the typescript compiler in lib, as well as the metadata files generated from ngc, and copies them into the dist folder, which is where the rollup compiler stores it's output. This is necessary if you want to be able to compile your typescript later on. If you're building in straight javascript, you will not need the typescript files, however the script will also copy the package.json file into the dist folder.

The dist folder is the resulting package, and can be installed locally via:

	npm install path/to/angular-payments-ts/dist

## Usage

Angular Payments TS includes a few directives, as well as an abstract form and control. The following types are defined and can be imported:

* AngularPaymentsModule
* AngularPaymentsCardDirective
* AngularPaymentsCVCDirective
* AngularPaymentsExpiryDirective
* AbstractCreditCardFormComponent
* CreditCardFormComponent

### AngularPaymentsModule

In order to utilize the directives or components, please ensure that you add AngularPaymentsModule to your app's module imports section

```typescript
...
import { AngularPaymentsModule } from 'angular-payments-ts';
...
@NgModule({
	...
	imports: [
		...
		AngularPaymentsModule
	],
	...
})
...
```

### AngularPaymentsCardDirective

```html
<input type="text" payments-card>
```

Is used to format and validate a credit card number. It will automatically detect the type of credit card based on the numbers entered, and will not allow extraneous numbers to be entered, and format the characters shown to the user as such. When used in validating, the value returned to the form control itself will not contain spaces.

This means that for the card number 4242 4242 4242 4242, the number will be displayed to the user as such. However, when accessing the value in the form control, it will be returned as '4242424242424242'.

In addition, the validate service will automatically append a card type class, in the form payments-card-[cardType]. So, for the example above, it would add payments-card-visa. This can be used for CSS styling.

The validate service will also find all payments elements on the screen (payments-[card|cvc|expiry]) and will add an attribute payments-card-type with value of the card type to each element. For the example above, it would add payments-card-type="visa". This is used in the cvc directive to ensure if 3 or 4 digits are required.

(Dev-Note): I suppose It might be better to add that directly to the form control instead, but I'm not sure how to go about doing that so I'm sticking with this until I figure it out.

### AngularPaymentsCVCDirective

```html
<input type="text" payments-cvc>
```

Is used to validate cvc numbers. If a credit card number has been entered, it will utilize the payments-card-type attribute that was assigned and limit the number accordingly (3 or 4). If no payments-card directive has been used, it will default to 4 digits.

### AngularPaymentsExpiryDirective

```html
<input type="text" payments-expiry>
```

Is used to format and validate expiration dates. It will automatically handle inputting a forward slash and prepending 0 to the month where approriate. In addition, the control's value will be set to a type of expiry { month: number, year: number }.

The user is able to enter either 2 digits or 4 digits for the year. If using 2 digits, it will be assumed that the current year should be used as a basis (ie: 25 = 2025). The year returned in the expiry type will reflect this.

### AbstractCreditCardFormComponent / CreditCardFormComponent

At the moment, I cannot get this to work properly, as I get an error when extending it. It has something to do with 2 types of the same name being defined, and not matching definitions even though they do. As such, I'm leaving this blank for now.

## Example

This is essentially the implementation of CreditCardFormComponent, without the output fields.

```typescript
@Component({
	selector: 'credit-card',
	template: `
	<form [formGroup]="creditCardForm" (ngSubmit)="submit(creditCardForm.value)">
		<label>
			<span>Cardholder name</span>
			<input type="text" name="" [formControl]="creditCardForm.controls['name']" />
		</label>
		<label>
			<span>Card number</span>
			<input type="text" name="" [formControl]="creditCardForm.controls['number']" payments-card />
		</label>
		<label>
			<span>Expiry</span>
			<input type="text" name="" [formControl]="creditCardForm.controls['expiry']" payments-expiry />
		</label>
		<label>
			<span>CVC</span>
			<input type="text" name="" [formControl]="creditCardForm.controls['cvc']" payments-cvc />
		</label>
		<input type="submit" value="Submit" />
	</form>
	`
})
export class CreditCardComponent {

	public creditCardForm: FormGroup;

	constructor(formBuilder: FormBuilder) {
        this.creditCardForm = formBuilder.group({
            name: [ '' ],
            number: [ '' ],
            cvc: [ '' ],
            expiry: [ '' ],
        });
	}

	submit(value) {
		if (!value.valid) {
			return;
		}
		let name = value.name;
		let number = value.number;
		let cvc = value.cvc;
		let expMonth = value.expiry.month;
		let expYear = value.expiry.year;
		
		// Do something with the result
	}

}
```

## License 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



