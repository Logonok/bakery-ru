/**
 * @copyright Copyright (c) 2021 Logonok <logonok@gmail.com>
 */
'use strict';

const Base = require('evado/component/validator/CustomValidator');

module.exports = class OrderCreationValidator extends Base {

    constructor (config) {
        super({
            skipOnAnyError: true,
            ...config
        });
    }

    async validateModel (model) {
        if (!model.isNew()) {
            return;
        }
        const query = model.view.findByCreator(model.getCreator());
        const exists = await query.byState(['draft', 'new']).id();
        if (exists) {
            return model.addError('', 'You already have a pending order');
        }
    }
};