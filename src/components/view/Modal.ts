import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<HTMLElement> {
    protected _content: HTMLElement | null = null;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;

        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', this.close.bind(this));
        this.container.querySelector('.modal__container')?.addEventListener('click', (e) => e.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content = value;
        const contentContainer = this.container.querySelector('.modal__content');
        if (contentContainer) {
            contentContainer.innerHTML = '';
            contentContainer.appendChild(value);
        }
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this._content = null;
        this.events.emit('modal:close');
    }

    render(): HTMLElement {
        return this.container;
    }
}