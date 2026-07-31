import { Form } from './Form';
import { IEvents } from '../base/Events';

export class OrderForm extends Form<{ payment: string; address: string }> {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.paymentButtons = container.querySelectorAll('.button_alt');
        this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.name;
                this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
                button.classList.add('button_alt-active');
                console.log('=== PAYMENT SELECTED ===', payment);
                this.events.emit('order:paymentChange', { payment });
            });
        });

        this.addressInput.addEventListener('input', () => {
            console.log('=== ADDRESS INPUT ===', this.addressInput.value);
            this.events.emit('order:addressChange', { address: this.addressInput.value });
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}