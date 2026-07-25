import { IProduct, IProductModel } from '../../types';
import { IEvents } from '../base/Events';  

export class ProductModel implements IProductModel {
    private _items: IProduct[] = [];
    private _selectedItem: IProduct | null = null;

    // Добавляем events
    constructor(protected events: IEvents) {}

    get items(): IProduct[] {
        return this._items;
    }

    get selectedItem(): IProduct | null {
        return this._selectedItem;
    }

    setItems(items: IProduct[]): void {
        this._items = items;
        // Генерируем событие об обновлении каталога
        this.events.emit('catalog:setProducts', { items: this._items });
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItemById(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setSelectedItem(item: IProduct): void {
        this._selectedItem = item;
        // Генерируем событие о выборе товара
        this.events.emit('catalog:setSelectedProduct', { selectedItem: this._selectedItem });
    }

    getSelectedItem(): IProduct | null {
        return this._selectedItem;
    }
}