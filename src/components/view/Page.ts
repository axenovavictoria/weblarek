import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IPageData {
    catalog: HTMLElement[];
    counter: number;
}

export class Page extends Component<IPageData> {
    protected gallery: HTMLElement;
    protected counterElement: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.gallery = container.querySelector('.gallery') as HTMLElement;
        this.counterElement = container.querySelector('.header__basket-counter') as HTMLElement;
        this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set catalog(items: HTMLElement[]) {
        this.gallery.innerHTML = '';
        items.forEach(item => this.gallery.appendChild(item));
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}