import { IBuyer, IBuyerModel, TPayment, TValidationErrors } from '../../types';

export class BuyerModel implements IBuyerModel {
    private _payment: TPayment | '' = '';
    private _address: string = '';
    private _email: string = '';
    private _phone: string = '';

    constructor() {}

    // ❌ Удаляем геттеры:
    // get payment(): TPayment | '' { return this._payment; }
    // get address(): string { return this._address; }
    // get email(): string { return this._email; }
    // get phone(): string { return this._phone; }

    // ✅ Единственный метод получения данных
    getData(): IBuyer {
        return {
            payment: this._payment,  // ✅ Без as TPayment
            address: this._address,
            email: this._email,
            phone: this._phone
        };
    }

    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        switch (field) {
            case 'payment':
                this._payment = value as TPayment | '';
                break;
            case 'address':
                this._address = value as string;
                break;
            case 'email':
                this._email = value as string;
                break;
            case 'phone':
                this._phone = value as string;
                break;
        }
    }

    clear(): void {
        this._payment = '';
        this._address = '';
        this._email = '';
        this._phone = '';
    }

    validate(fields?: Array<keyof IBuyer>): TValidationErrors {
        const errors: TValidationErrors = {};
        const fieldsToCheck = fields || ['payment', 'address', 'email', 'phone'];

        if (fieldsToCheck.includes('payment') && !this._payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        if (fieldsToCheck.includes('address') && !this._address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }

        if (fieldsToCheck.includes('email') && !this._email.trim()) {
            errors.email = 'Укажите email';
        }

        if (fieldsToCheck.includes('phone') && !this._phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}