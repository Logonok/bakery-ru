'use strict';

module.exports = {

    title: 'Пекарня',

    components: {
        'db': {
            settings: {
                'database': process.env.MONGO_NAME || 'bakery-ru',
            }
        },
        'cookie': {
            secret: 'bakery-ru.evado.sign' // key to sign cookie
        },
        'session': {
            secret: 'bakery-ru.evado.sign'  // key to sign session ID cookie
        },
        'i18n': {
            language: 'ru'
        },
        'router': {
            defaultModule: 'front'
        }
    },
    metaModels: {
        'base': {
            Class: require('evado-meta-base/base/BaseMeta')
        },
        'navigation': {
            Class: require('evado-meta-navigation/base/NavMeta')
        }
    },
    modules: {
        'api': {
            config: {
                modules: {
                    'base': {
                        Class: require('evado-api-base/Module')
                    },
                    'navigation': {
                        Class: require('evado-api-navigation/Module')
                    }
                }
            }
        },
        'studio': {
            Class: require('evado-module-studio/Module')
        },
        'office': {
            Class: require('evado-module-office/Module')
        },
        'account': {
            Class: require('evado-module-account/Module')
        },
        'admin': {
            Class: require('evado-module-admin/Module')
        },
        'front': {
            Class: require('../module/front/Module')
        }
    },
    users: require('./default-users'),
    userFilters: require('./default-userFilters'),
    security: require('./default-security'),
    notifications: require('./default-notifications'),
    tasks: require('./default-tasks'),
    utilities: require('./default-utilities'),
    eventHandlers: require('./default-eventHandlers'),
    listeners: require('./default-listeners'),
    sideMenu: require('./default-sideMenu'),
    params: {
        'enablePasswordChange': true,
        'enablePasswordReset': false,
        'enableSignUp': true,
        'enableSignUpVerification': false,
        'languageToggle': true
    }
};