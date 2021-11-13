'use strict';

const parent = require('evado/config/default-security');

module.exports = {

    metaPermissions: [{
        description: 'Полный доступ к данным',
        roles: 'administrator',
        type: 'allow',
        actions: 'all',
        targets: {type: 'all'}
    }, {
        description: 'Просматривать продукты, ингредиенты, изображения',
        roles: ['guest', 'user'],
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: [
                'product',
                'picture',
                'ingredient',
                'ingredientList'
            ]
        }
    }, {
        description: 'Просматривать заказчика, привязаного к пользователю',
        roles: 'user',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'customer'
        },
        rules: 'user'
    }, {
        description: 'Создавать заказы',
        roles: 'user',
        type: 'allow',
        actions: 'create',
        targets: {
            type: 'class',
            class: 'order'
        }
    }, {
        description: 'Просматривать свои заказы',
        roles: 'user',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'order'
        },
        rules: 'customer'
    }, {
        description: 'Редактировать свои черновые заказы',
        roles: 'user',
        type: 'allow',
        actions: ['update', 'delete'],
        targets: {
            type: 'class',
            class: 'order'
        },
        rules: [
            'draftOrder',
            'customer'
        ]
    }, {
        description: 'Просматривать элементы своих заказов',
        roles: 'user',
        type: 'allow',
        actions: 'read',
        targets: {
            type: 'class',
            class: 'orderItem'
        },
        rules: 'orderCustomer'
    }, {
        description: 'Создавать и удалять элементы своих черновых заказов',
        roles: 'user',
        type: 'allow',
        actions: ['create', 'delete'],
        targets: {
            type: 'class',
            class: 'orderItem'
        },
        rules: [
            'draftRefOrder',
            'orderCustomer'
        ]
    }, {
        description: 'Подтверждать свои черновые заказ',
        roles: 'user',
        type: 'allow',
        actions: 'update',
        targets: {
            type: 'transition',
            class: 'order',
            transition: ['confirm', 'modify']
        },
        rules: 'customer'
    }],

    permissions: {
        ...parent.permissions,

        'moduleAdmin': {
            label: 'Модуль администрирования',
            description: 'Доступ к модулю Администрирования'
        },
        'moduleOffice': {
            label: 'Модуль Офис',
            description: 'Доступ к модулю Офис'
        },
        'moduleStudio': {
            label: 'Модуль Студия',
            description: 'Доступ к модулю Студия'
        },
        'moduleApiBaseUpload': {
            label: 'Загрузка файлов',
            description: 'Загрузка файлов через модуль API базовых метаданных'
        }
    },

    roles: {
        'administrator': {
            label: 'Администратор',
            description: 'Полный доступ',
            children: [
                'moduleAdmin',
                'moduleOffice',
                'moduleStudio',
                'moduleApiBaseUpload'
            ]
        },
        'guest': {
            label: 'Гость',
            description: 'Автоматически назначаемая роль для анонимных пользователей'
        },
        'user': {
            label: 'Пользователь',
            description: 'Роль по умолчанию для зарегистрированных пользователей'
        }
    },

    rules: {
        'creator': {
            label: 'Создатель',
            description: 'Является ли пользователь создателем объекта',
            config: {
                Class: 'evado/component/meta/rbac/rule/UserRule',
                userAttr: '_creator'
            }
        },
        'customer': {
            label: 'Заказчик',
            description: 'Является ли пользователь заказчиком',
            config: {
                Class: 'evado/component/meta/rbac/rule/RefUserRule',
                refAttr: 'customer'
            }
        },
        'orderCustomer': {
            label: 'Ссылка на заказчика через заказ',
            description: 'Является ли пользователь заказчиком',
            config: {
                Class: 'evado/component/meta/rbac/rule/RefUserChainRule',
                refAttrs: ['order', 'customer']
            }
        },
        'draftOrder': {
            label: 'Черновой заказ',
            description: 'Является ли заказ черновым',
            config: {
                Class: 'evado/component/meta/rbac/rule/StateRule',
                value: 'draft'
            }
        },
        'draftRefOrder': {
            label: 'Ссылка на черновой заказа',
            description: 'Связан ли объект с черновым заказом',
            config: {
                Class: 'evado/component/meta/rbac/rule/RefStateRule',
                refAttr: 'order',
                value: 'draft'
            }
        },
        'user': {
            label: 'Пользователь',
            description: 'Связан ли пользователь с объектом',
            config: {
                Class: 'evado/component/meta/rbac/rule/UserRule'
            }
        }
    },

    // привязка пользователй к ролям
    assignments: {
        'Adam': 'administrator'
    },

    // правила автоматической привязки пользователей к ролям
    assignmentRules: {
    }
};