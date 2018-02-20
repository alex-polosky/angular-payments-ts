export type CardFormat = {
    type: string,
    pattern: RegExp,
    format: RegExp,
    inputFormat: RegExp,
    length: number[],
    cvcLength: number[],
    luhn: boolean
}

export type ExpiryString = {
    month: string,
    year: string
}

export type Expiry = {
    month: number,
    year: number
}

const _defaultFormat: RegExp = /(\d{1,4})/g;
const _defaultInputFormat: RegExp = /(?:^|\s)(\d{4})$/;

const _cardFormats: CardFormat[] = [
    {
        type: 'maestro',
        pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
        format: _defaultFormat,
        inputFormat: _defaultInputFormat,
        length: [12, 13, 14, 15, 16, 17, 18, 19],
        cvcLength: [3],
        luhn: true
    }, {
        type: 'dinersclub',
        pattern: /^(36|38|30[0-5])/,
        format: _defaultFormat,
        inputFormat: _defaultInputFormat,
        length: [14],
        cvcLength: [3],
        luhn: true
    }, {
        type: 'laser',
        pattern: /^(6706|6771|6709)/,
        format: _defaultFormat,
        inputFormat: _defaultInputFormat,
        length: [16, 17, 18, 19],
        cvcLength: [3],
        luhn: true
    }, {
        type: 'jcb',
        pattern: /^35/,
        format: _defaultFormat,
        inputFormat: _defaultInputFormat,
        length: [16],
        cvcLength: [3],
        luhn: true
    }, {
        type: 'unionpay',
        pattern: /^62/,
        format: _defaultFormat,
        inputFormat: _defaultInputFormat,
        length: [16, 17, 18, 19],
        cvcLength: [3],
        luhn: false
    }, {
        type: 'discover',
        pattern: /^(6011|65|64[4-9]|622)/,
        format: _defaultFormat,
        inputFormat: _defaultInputFormat,
        length: [16],
        cvcLength: [3],
        luhn: true
    }, {
        type: 'mastercard',
        pattern: /^5[1-5]/,
        format: _defaultFormat,
        inputFormat: _defaultInputFormat,
        length: [16],
        cvcLength: [3],
        luhn: true
    }, {
        type: 'mastercard',
        pattern: /^2[1-4]/,
        format: _defaultFormat,
        inputFormat: _defaultInputFormat,
        length: [16],
        cvcLength: [3],
        luhn: true
    }, {
        type: 'amex',
        pattern: /^3[47]/,
        format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
        inputFormat: /^(\d{4}|\d{4}\s\d{6})$/,
        length: [15],
        cvcLength: [3, 4],
        luhn: true
    }, {
        type: 'visa',
        pattern: /^4/,
        format: _defaultFormat,
        inputFormat: _defaultInputFormat,
        length: [13, 14, 15, 16],
        cvcLength: [3],
        luhn: true
    }
]

export class Cards {

    public static get defaultFormat(): RegExp {
        return _defaultFormat
    }

    public static get defaultInputFormat(): RegExp {
        return _defaultInputFormat;
    }

    public static get cardFormats(): CardFormat[] {
        return _cardFormats;
    }

    public static fromNumber(number: string): CardFormat {
        number = (number + '').replace(/\D/g, '');

        for (let i = 0; i < this.cardFormats.length; i++) {
            let card = this.cardFormats[i];
            if (card.pattern.test(number)) {
                return card;
            }
        }
    }

    public static fromType(type: string): CardFormat {
        for (let i = 0; i < this.cardFormats.length; i++) {
            let card = this.cardFormats[i];
            if (card.type == type) {
                return card;
            }
        }
    }
    
    public static parseExpiryAsString(value?: string): ExpiryString {
        value = value || '';

        value = value.replace(/\s/g, '');

        let _ref = value.split('/', 2);
        let month = _ref[0];
        let year = _ref[1];

        if (year && year.length === 2 && /^\d+$/.test(year)) {
            let prefix = (new Date())
                .getFullYear()
                .toString()
                .slice(0, 2);
            year = prefix + year;
        }

        return {
            month: month,
            year: year
        };
    }

    public static parseExpiry(value: ExpiryString): Expiry {
        return {
            month: parseInt(value.month, 10),
            year: parseInt(value.year, 10)
        }
    }

}