import { Card } from './Card';
import { IProduct } from '../../types';

interface ICardCatalogActions {
    onClick: (event: MouseEvent) => void;
}

export class CardCatalog extends Card<IProduct> {
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardCatalogActions) {
        super(container);
        this.button = container.querySelector('.card__button') as HTMLButtonElement;

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    set buttonText(value: string) {
        if (this.button) {
            this.button.textContent = value;
        }
    }

    set buttonDisabled(value: boolean) {
        if (this.button) {
            this.button.disabled = value;
        }
    }
}