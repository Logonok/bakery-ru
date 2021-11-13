/**
 * @copyright Copyright (c) 2021 Logonok <logonok@gmail.com>
 */
'use strict';

const Base = require('evado-meta-base/validator/Validator');

module.exports = class OrderItemQuantityValidator extends Base {

    constructor (config) {
        super({
            skipOnAnyError: true,
            ...config
        });
    }

    async validateAttr (name, model) {
        const quantity = model.get('quantity');
        const product = await model.related.resolve('product');
        if (product?.get('stock') < quantity) {
            return model.addError(name, 'Out of product stock');
        }
        const ingredients = await model.related.resolve('ingredients');
        for (const ingredient of ingredients) {
            if (ingredient.get('stock') < quantity) {
                return model.addError(name, 'Out of ingredient stock');
            }
        }
    }
};