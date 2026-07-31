import { Card } from './Card';
import { IProduct } from '../../types';

interface ICardPreviewActions {
    onButtonClick: (event: MouseEvent) => void;
}

export class CardPreview extends Card<IProduct> {
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardPreviewActions) {
        super(container);
        this.button = container.querySelector('.card__button') as HTMLButtonElement;

        if (actions?.onButtonClick) {
            this.button.addEventListener('click', actions.onButtonClick);
        }
    }

    set buttonText(value: string) {
        this.button.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.button.disabled = value;
    }
}