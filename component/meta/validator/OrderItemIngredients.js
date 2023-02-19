/**
 * @copyright Copyright (c) 2021 Logonok <logonok@gmail.com>
 */
'use strict';

const Base = require('evado-meta-base/validator/Validator');

module.exports = class OrderItemIngredientsValidator extends Base {

    constructor (config) {
        super({
            skipOnAnyError: true,
            skipOnEmpty: false,
            ...config
        });
    }

    async validateAttr (name, model) {
        const product = await model.related.resolve('product');
        if (!product) {
            return; // skip if the product is empty
        }
        const ingredients = await model.related.resolve('ingredients');
        const lists = await product.related.resolve('ingredientLists');
        if (!this.checkIngredientsByLists(ingredients, lists)) {
            return model.addError(name, 'Invalid ingredients');
        }
    }

    checkIngredientsByLists (ingredients, lists) {
        if (ingredients.length > lists.length) {
            return false;
        }
        const found = {};
        for (const ingredient of ingredients) {
            const list = this.getListByIngredient(ingredient, lists);
            if (!list) {
                return false;
            }
            found[list.getId()] = list;
        }
        if (Object.values(found).length !== ingredients.length) { // check unique lists
            return false;
        }
        for (const list of lists) {
            if (list.get('required') && !found[list.getId()]) {
                return false;
            }
        }
        return true;
    }

    getListByIngredient (ingredient, lists) {
        const id = ingredient.getId();
        for (const list of lists) {
            const ingredients = list.get('ingredients');
            if (MongoHelper.includes(id, ingredients)) {
                return list;
            }
        }
    }
};

const MongoHelper = require('areto/helper/MongoHelper');