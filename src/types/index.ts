export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export { IEvents } from '../components/base/Events';

// Типы
export type TCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка';
export type TPayment = 'card' | 'cash';

// Интерфейс товара
export interface IProduct {
    id: string;
    title: string;
    image: string;
    category: TCategory;
    price: number | null;
    description: string;
}

// Интерфейс покупателя
export interface IBuyer {
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
}

// Интерфейсы моделей
export interface IProductModel {
    items: IProduct[];
    selectedItem: IProduct | null;
    setItems(items: IProduct[]): void;
    getItems(): IProduct[];
    getItemById(id: string): IProduct | undefined;
    setSelectedItem(item: IProduct): void;
    getSelectedItem(): IProduct | null;
}

export interface IBasketModel {
    items: IProduct[];
    addItem(item: IProduct): void;
    removeItem(id: string): void;
    clear(): void;
    getItems(): IProduct[];
    getTotal(): number;
    getCount(): number;
    contains(id: string): boolean;
    canCheckout(): boolean;
    getItemIds(): string[];
}

export interface IBuyerModel {
    payment: TPayment | '';
    address: string;
    email: string;
    phone: string;
    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void;
    getData(): IBuyer;
    clear(): void;
    validate(fields?: Array<keyof IBuyer>): Partial<Record<keyof IBuyer, string>>;
    isValid(): boolean;
    validateField<K extends keyof IBuyer>(field: K): string | null;
}

// Интерфейсы для API
export interface IApiProductResponse {
    items: IProduct[];
    total: number;
}

export interface IOrderData {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export interface IWebLarekApi {
    getProducts(): Promise<IApiProductResponse>;
    postOrder(orderData: IOrderData): Promise<IOrderResponse>;
}