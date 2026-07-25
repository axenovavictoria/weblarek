import { 
    IApi,     IWebLarekApi, 
    IApiProductResponse, 
    IOrderData, 
    IOrderResponse 
} from '../../types';

export class WebLarekApi implements IWebLarekApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<IApiProductResponse> {
        return this.api.get<IApiProductResponse>('/product');
    }

    async postOrder(orderData: IOrderData): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order', orderData);
    }
}