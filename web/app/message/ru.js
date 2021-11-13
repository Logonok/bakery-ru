'use strict';
/**
 * Extend default translations
 *
 * Use: Jam.t('Some text')
 * Use: <span data-t="">Some text</span>
 * Use: <div title="Some text" data-t=""></div>
 * Use: <input placeholder="Some text" type="text" data-t="">
 */
Object.assign(Jam.I18n.defaults, {

    'Delete order': 'Удалить заказ',
    'Delete this order permanently?': 'Удалить этот заказ окончательно?',

    'Invalid ingredients': 'Недопустимые ингредиенты',

    'Main': 'Главная',

    'Order': 'Заказ',
    'Orders': 'Заказы',

    'Out of ingredient stock': 'Недостаточно запасов ингредиентов',
    'Out of product stock': 'Недостаточно запасов продукта',

    'Remove this item from the order?': 'Удалить данный элемент из заказа?',

    'Total number of order items is no more than {max}': 'Общее количество элементов заказа не больше {max}',

    'You already have a pending order': 'У вас уже есть ожидающий заказ',
    'You have no orders': 'У вас нет заказов'
});

// METADATA

Jam.I18n.meta = {

};