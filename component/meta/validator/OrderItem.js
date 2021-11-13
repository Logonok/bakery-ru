/**
 * @copyright Copyright (c) 2021 Logonok <logonok@gmail.com>
 */
'use strict';

const Base = require('evado/component/validator/CustomValidator');

module.exports = class OrderItemValidator extends Base {

    /**
     * @param {Object} config
     * @param {number} config.maxItems - Max items in one order
     */
    constructor (config) {
        super({
            maxItems: 10,
            skipOnAnyError: true,
            ...config
        })
    }

    async validateAttr (name, model) {
        const query = model.view.find({order: model.get('order')});
        const counter = await query.count();
        if (counter >= this.maxItems) {
            model.addError(name, this.getClientMessage());
        }
    }

    getClientMessage () {
        return this.createClientMessage(this.message, 'Total number of order items is no more than {max}', {
            max: this.maxItems
        });
    }
};