import { IProduct, IBasketModel } from '../../types';

export class BasketModel implements IBasketModel {
    private _items: IProduct[] = [];

    constructor() {}

    /**
     * Добавить товар в корзину
     */
    addItem(item: IProduct): void {
        if (item.price === null) return; 
        if (!this.contains(item.id)) {
            this._items.push(item);
        }
    }

    /**
     * Удалить товар из корзины по id
     */
    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
    }

    /**
     * Очистить корзину
     */
    clear(): void {
        this._items = [];
    }

    /**
     * Получить все товары в корзине
     */
    getItems(): IProduct[] {
        return this._items;
    }

    /**
     * Получить общую стоимость всех товаров
     */
    getTotal(): number {
        return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    /**
     * Получить количество товаров в корзине
     */
    getCount(): number {
        return this._items.length;
    }

    /**
     * Проверить наличие товара в корзине по id
     */
    contains(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}