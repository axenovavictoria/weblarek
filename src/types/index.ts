export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

import { categoryMap } from '../utils/constants';

// ============ ТИПЫ ============

export type TCategory = keyof typeof categoryMap;
export type TPayment = 'card' | 'cash';
export type TValidationErrors = Partial<Record<keyof IBuyer, string>>;

// ============ ИНТЕРФЕЙСЫ ============

export interface IProduct {
    id: string;
    title: string;
    image: string;
    category: TCategory;
    price: number | null;
    description: string;
}

export interface IBuyer {
    payment: TPayment | '';  // ✅ Добавлено | ''
    address: string;
    email: string;
    phone: string;
}

export interface IProductModel {
    setItems(items: IProduct[]): void;
    getItems(): IProduct[];
    getItemById(id: string): IProduct | undefined;
    setSelectedItem(item: IProduct): void;
    getSelectedItem(): IProduct | null;
}

export interface IBasketModel {
    addItem(item: IProduct): void;
    removeItem(id: string): void;
    clear(): void;
    getItems(): IProduct[];
    getTotal(): number;
    getCount(): number;
    contains(id: string): boolean;
}

export interface IBuyerModel {
    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void;
    getData(): IBuyer;
    clear(): void;
    validate(fields?: Array<keyof IBuyer>): TValidationErrors;
}

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