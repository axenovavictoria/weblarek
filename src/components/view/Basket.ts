import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasketData {
    items: HTMLElement[];
    total: number;
    checkoutDisabled?: boolean;
}

export class Basket extends Component<IBasketData> {
    protected list: HTMLElement;
    protected totalElement: HTMLElement;
    protected checkoutButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.list = container.querySelector('.basket__list') as HTMLElement;
        this.totalElement = container.querySelector('.basket__price') as HTMLElement;
        this.checkoutButton = container.querySelector('.basket__button') as HTMLButtonElement;

        this.checkoutButton.addEventListener('click', () => {
            this.events.emit('basket:checkout');
        });
    }

    set items(items: HTMLElement[]) {
        if (items.length === 0) {
            this.list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
        } else {
            this.list.innerHTML = '';
            items.forEach(item => this.list.appendChild(item));
        }
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set checkoutDisabled(value: boolean) {
        this.checkoutButton.disabled = value;
    }

    render(data?: Partial<IBasketData>): HTMLElement {
        if (data) {
            if (data.items !== undefined) this.items = data.items;
            if (data.total !== undefined) this.total = data.total;
            if (data.checkoutDisabled !== undefined) this.checkoutDisabled = data.checkoutDisabled;
        }
        return this.container;
    }
}