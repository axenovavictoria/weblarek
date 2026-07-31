import { Form } from './Form';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';

export class OrderForm extends Form<{ payment: TPayment | ''; address: string }> {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;
    protected addressInput: HTMLInputElement;
    protected submitBtn: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.paymentButtons = container.querySelectorAll('.button_alt');
        this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;
        this.submitBtn = container.querySelector('.order__button') as HTMLButtonElement;

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.name as TPayment;
                this.events.emit('order:paymentChange', { payment });
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:addressChange', { address: this.addressInput.value });
        });

        if (this.submitBtn) {
            this.submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Кнопка "Далее" нажата');
                this.events.emit('order:submit');
            });
        }
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    set payment(value: TPayment | '') {
        this.paymentButtons.forEach(btn => {
            const isActive = btn.name === value;
            btn.classList.toggle('button_alt-active', isActive);
        });
    }

    render(data?: Partial<{ payment: TPayment | ''; address: string }>): HTMLElement {
        if (data) {
            if (data.address !== undefined) this.address = data.address;
            if (data.payment !== undefined) this.payment = data.payment;
        }
        return this.container;
    }
}