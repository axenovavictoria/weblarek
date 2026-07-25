import { IBuyer, IBuyerModel, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class BuyerModel implements IBuyerModel {
    private _payment: TPayment | '' = '';
    private _address: string = '';
    private _email: string = '';
    private _phone: string = '';

    // Добавляем events
    constructor(protected events: IEvents) {}

    get payment(): TPayment | '' {
        return this._payment;
    }

    get address(): string {
        return this._address;
    }

    get email(): string {
        return this._email;
    }

    get phone(): string {
        return this._phone;
    }

    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        switch (field) {
            case 'payment':
                this._payment = value as TPayment | '';
                this.events.emit('buyer:changePayment', { payment: this._payment });
                break;
            case 'address':
                this._address = value as string;
                this.events.emit('buyer:changeAddress', { address: this._address });
                break;
            case 'email':
                this._email = value as string;
                this.events.emit('buyer:changeEmail', { email: this._email });
                break;
            case 'phone':
                this._phone = value as string;
                this.events.emit('buyer:changePhone', { phone: this._phone });
                break;
        }
    }

    getData(): IBuyer {
        return {
            payment: this._payment as TPayment,
            address: this._address,
            email: this._email,
            phone: this._phone
        };
    }

    clear(): void {
        this._payment = '';
        this._address = '';
        this._email = '';
        this._phone = '';
        this.events.emit('buyer:clear');
    }

    validate(fields?: Array<keyof IBuyer>): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};
        const fieldsToCheck = fields || ['payment', 'address', 'email', 'phone'];

        if (fieldsToCheck.includes('payment') && !this._payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        if (fieldsToCheck.includes('address') && !this._address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }

        if (fieldsToCheck.includes('email')) {
            if (!this._email.trim()) {
                errors.email = 'Укажите email';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email)) {
                errors.email = 'Некорректный email';
            }
        }

        if (fieldsToCheck.includes('phone')) {
            if (!this._phone.trim()) {
                errors.phone = 'Укажите телефон';
            } else if (!/^\+?[0-9\s\-()]{10,15}$/.test(this._phone)) {
                errors.phone = 'Некорректный телефон';
            }
        }

        return errors;
    }

    isValid(): boolean {
        return Object.keys(this.validate()).length === 0;
    }

    validateField<K extends keyof IBuyer>(field: K): string | null {
        const errors = this.validate([field]);
        return errors[field] || null;
    }
}