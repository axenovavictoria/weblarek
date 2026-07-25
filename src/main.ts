import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events'; 
import { WebLarekApi } from './components/api/WebLarekApi';
import { ProductModel } from './components/models/ProductModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';

import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';  

// ========== СОЗДАЁМ БРОКЕР СОБЫТИЙ ==========
const events = new EventEmitter();

// ========== НАСТРАИВАЕМ API ==========
const apiInstance = new Api(API_URL);
const webLarekApi = new WebLarekApi(apiInstance);

// ========== СОЗДАЁМ МОДЕЛИ С ПЕРЕДАЧЕЙ EVENTS ==========
const productModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

console.log('========== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ==========');

// 1. Тестирование ProductModel
console.log('\n--- 1. Каталог на главной ---');
productModel.setItems(apiProducts.items);
console.log('Сохранен массив товаров');

const allProducts = productModel.getItems();
console.log(`Получен массив товаров: ${allProducts.length} шт.`);

if (allProducts[0]) {
    productModel.setSelectedItem(allProducts[0]);
    console.log(`Сохранена выбранная карточка: ${allProducts[0].title}`);
}

console.log(`Получена выбранная карточка: ${productModel.getSelectedItem()?.title}`);

// 2. Тестирование BasketModel
console.log('\n--- 2. Корзина с товарами ---');
const productsToAdd = allProducts.slice(0, 2);
productsToAdd.forEach((product, index) => {
    basketModel.addItem(product);
    console.log(`Добавлен товар ${index + 1}: ${product.title}`);
});

console.log(`Количество товаров: ${basketModel.getCount()}`);
console.log(`Сумма стоимости: ${basketModel.getTotal()} синапсов`);

if (productsToAdd[0]) {
    console.log(`Наличие товара: ${basketModel.contains(productsToAdd[0].id)}`);
    basketModel.removeItem(productsToAdd[0].id);
    console.log(`Удален товар: ${productsToAdd[0].title}`);
    console.log(`Осталось товаров: ${basketModel.getCount()}`);
}

// 3. Тестирование BuyerModel
console.log('\n--- 3. Покупатель ---');
buyerModel.setField('payment', 'card');
buyerModel.setField('address', 'Москва, ул. Ленина, д. 1');
buyerModel.setField('email', 'test@example.com');
buyerModel.setField('phone', '+7 999 123-45-67');
console.log('Сохранены данные покупателя');

console.log('Получены данные:', buyerModel.getData());

const errors = buyerModel.validate();
if (Object.keys(errors).length === 0) {
    console.log('Данные валидны');
} else {
    console.log('Ошибки:', errors);
}

console.log(`Все данные валидны: ${buyerModel.isValid()}`);

// 4. Проверка оформления
console.log('\n--- 4. Проверка оформления заказа ---');
basketModel.addItem(allProducts[0]);
basketModel.addItem(allProducts[1]);
console.log(`В корзине: ${basketModel.getCount()} товаров`);
console.log(`Можно оформить: ${basketModel.canCheckout()}`);
console.log(`ID товаров: ${basketModel.getItemIds().join(', ')}`);

// ========== ПОДПИСКА НА СОБЫТИЯ ДЛЯ ДЕМОНСТРАЦИИ ==========
console.log('\n--- Демонстрация событий ---');

events.on('catalog:setProducts', (data) => {
    console.log('Событие: catalog:setProducts', data);
});

events.on('basket:change', (data) => {
    console.log('Событие: basket:change', data);
});

events.on('buyer:changeEmail', (data) => {
    console.log('Событие: buyer:changeEmail', data);
});

// 5. Работа с сервером
console.log('\n========== РАБОТА С СЕРВЕРОМ ==========');

webLarekApi.getProducts()
    .then(response => {
        console.log('Товары получены с сервера');
        console.log(`Количество: ${response.items.length}`);
        console.log(`Всего: ${response.total}`);
        
        productModel.setItems(response.items);
        console.log('Товары сохранены в модель каталога');
        
        const savedProducts = productModel.getItems();
        console.log(`В модели каталога: ${savedProducts.length} товаров`);
        
        console.log('  Первые 3 товара:');
        savedProducts.slice(0, 3).forEach((product, index) => {
            console.log(`    ${index + 1}. ${product.title} - ${product.price} синапсов`);
        });
    })
    .catch(error => {
        console.error('Ошибка при получении товаров:', error);
    });

console.log('\n========== ПРОЕКТ ГОТОВ ==========');