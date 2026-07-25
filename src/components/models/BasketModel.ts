import { IProduct, IBasketModel } from '../../types';
import { IEvents } from '../base/Events';

export class BasketModel implements IBasketModel {
    private _items: IProduct[] = [];

    // Добавляем events
    constructor(protected events: IEvents) {}

    get items(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        if (!item) return;
        if (item.price === null) return;
        if (!this.contains(item.id)) {
            this._items.push(item);
            // Генерируем событие об изменении корзины
            this.events.emit('basket:change', { items: this._items });
        }
    }

    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        // Генерируем событие об изменении корзины
        this.events.emit('basket:change', { items: this._items });
    }

    clear(): void {
        this._items = [];
        this.events.emit('basket:clear');
        this.events.emit('basket:change', { items: this._items });
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getTotal(): number {
        return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    getCount(): number {
        return this._items.length;
    }

    contains(id: string): boolean {
        return this._items.some(item => item.id === id);
    }

    canCheckout(): boolean {
        return this._items.length > 0 && this.getTotal() > 0;
    }

    getItemIds(): string[] {
        return this._items.map(item => item.id);
    }
}