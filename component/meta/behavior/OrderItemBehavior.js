/**
 * @copyright Copyright (c) 2021 Logonok <logonok@gmail.com>
 */
'use strict';

const Base = require('evado-meta-base/behavior/Behavior');

module.exports = class OrderItemBehavior extends Base {

    async beforeInsert () {
        await this.setPrice();
        await this.updateStock(-1);
    }

    async afterDelete () {
        await this.updateStock(1);
    }

    async setPrice () {
        let product = await this.resolveProduct();
        let price = product?.get('price');
        let ingredients = await this.resolveIngredients();
        for (let ingredient of ingredients) {
            price += ingredient.get('price');
        }
        price = MathHelper.round(price * this.get('quantity'), 2);
        this.owner.set('price', price);
    }

    async updateStock (sign) {
        const delta = this.get('quantity') * sign;
        const product = await this.resolveProduct();
        if (product) {
            const stock = product.get('stock') + delta;
            await product.findSelf().update({stock});
        }
        const ingredients = await this.resolveIngredients();
        for (const ingredient of ingredients) {
            const stock = ingredient.get('stock') + delta;
            await ingredient.findSelf().update({stock});
        }
    }

    resolveIngredients () {
        return this.owner.related.resolve('ingredients');
    }

    resolveProduct () {
        return this.owner.related.resolve('product');
    }
};

const MathHelper = require('areto/helper/MathHelper');