import { IBuyer, IBuyerModel, TPayment, TValidationErrors } from '../../types';
import { IEvents } from '../base/Events';

export class BuyerModel implements IBuyerModel {
    private _payment: TPayment | '' = '';
    private _address: string = '';
    private _email: string = '';
    private _phone: string = '';

    constructor(protected events: IEvents) {}

    // метод получения данных
    getData(): IBuyer {
        return {
            payment: this._payment,
            address: this._address,
            email: this._email,
            phone: this._phone
        };
    }

    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        switch (field) {
            case 'payment':
                this._payment = value as TPayment | '';
                this.events.emit('buyer:changed', { field: 'payment', value: this._payment });
                break;
            case 'address':
                this._address = value as string;
                this.events.emit('buyer:changed', { field: 'address', value: this._address });
                break;
            case 'email':
                this._email = value as string;
                this.events.emit('buyer:changed', { field: 'email', value: this._email });
                break;
            case 'phone':
                this._phone = value as string;
                this.events.emit('buyer:changed', { field: 'phone', value: this._phone });
                break;
        }
    }

    clear(): void {
        this._payment = '';
        this._address = '';
        this._email = '';
        this._phone = '';
        this.events.emit('buyer:cleared');
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