import { Component } from '../base/Component';
import { categoryMap, CDN_URL } from '../../utils/constants';

export abstract class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._title = container.querySelector('.card__title') as HTMLElement;
        this._price = container.querySelector('.card__price') as HTMLElement;
        this._category = container.querySelector('.card__category') as HTMLElement || undefined;
        this._image = container.querySelector('.card__image') as HTMLImageElement || undefined;
        this._description = container.querySelector('.card__text') as HTMLElement || undefined;
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            const modifier = categoryMap[value as keyof typeof categoryMap] || '';
            this._category.className = `card__category ${modifier}`;
        }
    }

    set image(value: string) {
        if (this._image) {
            const fullPath = value.startsWith('http') ? value : `${CDN_URL}${value}`;
            this.setImage(this._image, fullPath);
        }
    }

    set description(value: string) {  
        if (this._description) {
            this._description.textContent = value;
        }
    }

    protected setImage(element: HTMLImageElement, src: string) {
        if (element) {
            element.src = src;
        }
    }
}