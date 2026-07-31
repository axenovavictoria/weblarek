import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.submitButton = container.querySelector('.button[type="submit"]') as HTMLButtonElement;
        this.errorsElement = container.querySelector('.form__errors') as HTMLElement;

        container.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('=== SUBMIT EVENT FIRED ===', this.constructor.name);
            this.events.emit(`${this.constructor.name.toLowerCase()}:submit`);
        });
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }

    set submitDisabled(value: boolean) {
        this.submitButton.disabled = value;
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.constructor.name.toLowerCase()}:${String(field)}Change`, { field, value });
    }

    render(data?: Partial<T>): HTMLElement {
        if (data) {
            Object.assign(this, data);
        }
        return this.container;
    }
}