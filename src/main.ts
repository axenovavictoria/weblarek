import './scss/styles.scss';

// Базовые классы
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

// API
import { WebLarekApi } from './components/api/WebLarekApi';

// Модели данных
import { ProductModel } from './components/models/ProductModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';

// Компоненты представления
import { Modal } from './components/view/Modal';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { Page } from './components/view/Page';

// Утилиты и типы
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { IProduct, IOrderData, TPayment } from './types';

// ============================================================
// НАСТРОЙКА API
// ============================================================
const apiInstance = new Api(API_URL);
const api = new WebLarekApi(apiInstance);

// ============================================================
// БРОКЕР СОБЫТИЙ
// ============================================================
const events = new EventEmitter();

// ============================================================
// МОДЕЛИ ДАННЫХ
// ============================================================
const productModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// ============================================================
// КОМПОНЕНТЫ ПРЕДСТАВЛЕНИЯ
// ============================================================

// Модальное окно
const modalElement = document.getElementById('modal-container') as HTMLElement;
const modal = new Modal(modalElement, events);

// Страница
const pageElement = document.querySelector('.page__wrapper') as HTMLElement;
const page = new Page(pageElement, events);

// Шаблоны карточек
const cardCatalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;

// Корзина
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const basketContainer = cloneTemplate<HTMLElement>(basketTemplate);
const basket = new Basket(basketContainer, events);

// Формы
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;

const orderFormContainer = cloneTemplate<HTMLFormElement>(orderTemplate);
const contactsFormContainer = cloneTemplate<HTMLFormElement>(contactsTemplate);

const orderForm = new OrderForm(orderFormContainer, events);
const contactsForm = new ContactsForm(contactsFormContainer, events);

// Успешное оформление
const successTemplate = document.getElementById('success') as HTMLTemplateElement;
const successContainer = cloneTemplate<HTMLElement>(successTemplate);
const successView = new Success(successContainer, events);

// ============================================================
// ПРЕЗЕНТЕР
// ============================================================

// --- Загрузка товаров ---
api.getProducts()
    .then(response => {
        productModel.setItems(response.items);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });

// --- Изменение каталога ---
events.on('catalog:changed', () => {
    const products = productModel.getItems();
    const cards = products.map(product => {
        const cardElement = cloneTemplate<HTMLElement>(cardCatalogTemplate);
        const card = new CardCatalog(cardElement, {
            onClick: () => events.emit('product:select', product)
        });
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = product.image;
        card.buttonText = 'В корзину';
        card.buttonDisabled = product.price === null;
        return card.render();
    });
    page.catalog = cards;
});

// --- Выбор товара ---
events.on('product:select', (product: IProduct) => {
    if (product) {
        productModel.setSelectedItem(product);
    }
});

// --- Отображение выбранного товара ---
events.on('catalog:selected', (data: { item: IProduct }) => {
    const product = data.item;
    const cardElement = cloneTemplate<HTMLElement>(cardPreviewTemplate);
    const card = new CardPreview(cardElement, {
        onButtonClick: () => {
            if (basketModel.contains(product.id)) {
                basketModel.removeItem(product.id);
            } else {
                basketModel.addItem(product);
            }
            modal.close();
        }
    });
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image;
    card.description = product.description;

    const inBasket = basketModel.contains(product.id);
    card.buttonText = product.price === null ? 'Недоступно' : (inBasket ? 'Удалить из корзины' : 'В корзину');
    card.buttonDisabled = product.price === null;

    modal.content = card.render();
    modal.open();
});

// --- Обновление корзины ---
events.on('basket:changed', () => {
    page.counter = basketModel.getCount();
    
    const items = basketModel.getItems();
    if (items.length === 0) {
        basket.items = [];
        basket.total = 0;
        basket.checkoutDisabled = true;
    } else {
        const cards = items.map((product, index) => {
            const cardElement = cloneTemplate<HTMLElement>(cardBasketTemplate);
            const card = new CardBasket(cardElement, {
                onDelete: () => {
                    basketModel.removeItem(product.id);
                }
            });
            card.title = product.title;
            card.price = product.price;
            card.index = index + 1;
            return card.render();
        });
        basket.items = cards;
        basket.total = basketModel.getTotal();
        basket.checkoutDisabled = false;
    }
});

// --- Открытие корзины ---
events.on('basket:open', () => {
    events.emit('basket:changed');
    modal.content = basket.render();
    modal.open();
});

// --- Оформление заказа (первый шаг) ---
events.on('basket:checkout', () => {
    buyerModel.setField('payment', '' as TPayment | '');
    buyerModel.setField('address', '');
    
    orderForm.address = '';
    orderForm.errors = '';
    orderForm.submitDisabled = true;
    
    const buttons = orderFormContainer.querySelectorAll('.button_alt');
    buttons.forEach(btn => btn.classList.remove('button_alt-active'));
    
    modal.content = orderForm.render();
    modal.open();
});

// --- Обработка формы заказа (первый шаг) ---
events.on('order:paymentChange', (data: { payment: string }) => {
    buyerModel.setField('payment', data.payment as TPayment);
    const errors = buyerModel.validate(['payment', 'address']);
    orderForm.errors = errors.payment || errors.address || '';
    orderForm.submitDisabled = Object.keys(errors).length > 0;
});

events.on('order:addressChange', (data: { address: string }) => {
    buyerModel.setField('address', data.address);
    const errors = buyerModel.validate(['payment', 'address']);
    orderForm.errors = errors.payment || errors.address || '';
    orderForm.submitDisabled = Object.keys(errors).length > 0;
});

events.on('order:submit', () => {
    console.log('=== order:submit START ===');
    const buyerData = buyerModel.getData();
    console.log('buyerData:', buyerData);
    
    if (!buyerData.payment) {
        orderForm.errors = 'Выберите способ оплаты';
        return;
    }
    
    if (!buyerData.address) {
        orderForm.errors = 'Укажите адрес доставки';
        return;
    }
    
    console.log('Opening contacts form');
    contactsForm.email = '';
    contactsForm.phone = '';
    contactsForm.errors = '';
    contactsForm.submitDisabled = true;
    
    modal.content = contactsForm.render();
    modal.open();
    console.log('=== order:submit DONE ===');
});

// --- Обработка формы контактов (второй шаг) ---
events.on('contacts:emailChange', (data: { email: string }) => {
    buyerModel.setField('email', data.email);
    const errors = buyerModel.validate(['email', 'phone']);
    contactsForm.errors = errors.email || errors.phone || '';
    contactsForm.submitDisabled = Object.keys(errors).length > 0;
});

events.on('contacts:phoneChange', (data: { phone: string }) => {
    buyerModel.setField('phone', data.phone);
    const errors = buyerModel.validate(['email', 'phone']);
    contactsForm.errors = errors.email || errors.phone || '';
    contactsForm.submitDisabled = Object.keys(errors).length > 0;
});

// --- Отправка заказа ---
events.on('contacts:submit', () => {
    console.log('=== contacts:submit START ===');
    const buyerData = buyerModel.getData();
    console.log('buyerData:', buyerData);
    
    if (!buyerData.payment) {
        contactsForm.errors = 'Выберите способ оплаты';
        return;
    }

    const errors = buyerModel.validate(['payment', 'email', 'phone', 'address']);
    if (Object.keys(errors).length > 0) {
        contactsForm.errors = Object.values(errors).join('. ');
        return;
    }

    const orderData: IOrderData = {
        payment: buyerData.payment as TPayment,
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: basketModel.getTotal(),
        items: basketModel.getItems().map(item => item.id)
    };
    console.log('orderData:', orderData);

    api.postOrder(orderData)
        .then(response => {
            console.log('Order successful:', response);
            successView.total = response.total;
            modal.content = successView.render();
            modal.open();
            basketModel.clear();
            buyerModel.clear();
        })
        .catch(error => {
            console.error('Ошибка оформления заказа:', error);
            contactsForm.errors = 'Ошибка при оформлении заказа. Попробуйте позже.';
        });
});

// --- Закрытие модального окна ---
events.on('modal:close', () => {});

events.on('success:close', () => {
    modal.close();
});

console.log('Веб-ларёк запущен');