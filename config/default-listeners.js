'use strict';

module.exports = [{
    description: 'Создать заказчика при регистрации пользователя',
    events: 'auth.register',
    handlers: 'customerInstantiation'
}];