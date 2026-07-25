import './scss/styles.scss';

import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';
import { ProductModel } from './components/models/ProductModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';

import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';

// ========== НАСТРАИВАЕМ API ==========
const apiInstance = new Api(API_URL);
const webLarekApi = new WebLarekApi(apiInstance);

// ========== СОЗДАЁМ МОДЕЛИ ==========
const productModel = new ProductModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

console.log('========== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ==========');

// ========== 1. Тестирование ProductModel ==========
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

// ========== 2. Тестирование BasketModel ==========
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

// ========== 3. Тестирование BuyerModel ==========
console.log('\n--- 3. Покупатель ---');

// 3.1 Валидация с пустыми данными
console.log('\n--- 3.1 Валидация с пустыми данными ---');
const emptyErrors = buyerModel.validate();
console.log('Ошибки при пустых данных:', emptyErrors);
console.log(`Количество ошибок: ${Object.keys(emptyErrors).length}`);
console.log(`Все поля невалидны: ${Object.keys(emptyErrors).length === 4}`);

// 3.2 Валидация с частично заполненными данными
console.log('\n--- 3.2 Валидация с частично заполненными данными ---');
buyerModel.setField('payment', 'card');
buyerModel.setField('address', 'Москва, ул. Ленина, д. 1');

const partialErrors = buyerModel.validate();
console.log('Ошибки при частичном заполнении:', partialErrors);
console.log(`Заполнены и валидны: payment, address`);
console.log(`Ошибка для email: ${partialErrors.email || 'нет ошибки'}`);
console.log(`Ошибка для phone: ${partialErrors.phone || 'нет ошибки'}`);
console.log(`Поле payment валидно: ${!partialErrors.payment}`);
console.log(`Поле address валидно: ${!partialErrors.address}`);
console.log(`Поле email невалидно: ${!!partialErrors.email}`);
console.log(`Поле phone невалидно: ${!!partialErrors.phone}`);

// 3.3 Валидация с полностью заполненными данными
console.log('\n--- 3.3 Валидация с полностью заполненными данными ---');
buyerModel.setField('email', 'test@example.com');
buyerModel.setField('phone', '+7 999 123-45-67');

const fullErrors = buyerModel.validate();
console.log('Ошибки при полном заполнении:', fullErrors);
console.log(`Все поля валидны: ${Object.keys(fullErrors).length === 0}`);

// 3.4 Получение всех данных
console.log('\n--- 3.4 Получение данных ---');
console.log('Получены данные:', buyerModel.getData()); 

// 3.5 Очистка данных
console.log('\n--- 3.5 Очистка данных ---');
buyerModel.clear();
console.log('Данные очищены');
console.log('Текущие данные:', buyerModel.getData());  

const data = buyerModel.getData();
console.log(`Все поля пусты: ${!data.payment && !data.address && !data.email && !data.phone}`);

// ========== 4. Проверка оформления ==========
console.log('\n--- 4. Проверка оформления заказа ---');
basketModel.addItem(allProducts[0]);
basketModel.addItem(allProducts[1]);
console.log(`В корзине: ${basketModel.getCount()} товаров`);
console.log(`Можно оформить: ${basketModel.getCount() > 0 && basketModel.getTotal() > 0}`);
const itemIds = basketModel.getItems().map(item => item.id);
console.log(`ID товаров: ${itemIds.join(', ')}`);

// ========== 5. Работа с сервером ==========
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