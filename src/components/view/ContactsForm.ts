import { Form } from './Form';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form<{ email: string; phone: string }> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;

        this.emailInput.addEventListener('input', () => {
            this.events.emit('contacts:emailChange', { email: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:phoneChange', { phone: this.phoneInput.value });
        });

        // Добавляем обработчик на кнопку "Оплатить"
        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('ContactsForm: кнопка "Оплатить" нажата');
            this.events.emit('contacts:submit');
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}