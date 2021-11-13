
Front.Product = class Product extends Front.Loadable {

    init () {
        super.init();
        this.on('click', '[data-command="order"]', this.onOrder.bind(this));
        this.on('input', '[name]', this.onChange.bind(this));
    }

    getUrl () {
        return super.getUrl('read');
    }

    getPostData () {
        return {
            class: 'product',
            view: 'public',
            id: this.id
        };
    }

    onDone (data) {
        super.onDone(...arguments);
        this.data = data;
        this.find('[data-command="order"]').toggle(data.stock > 0);
        this.onChange();
    }

    render (data) {
        data.requiredIngredientGroup = this.renderIngredientGroup('Обязательные ингредиенты', true, data);
        data.optionalIngredientGroup = this.renderIngredientGroup('Дополнительные ингредиенты', false, data);
        return this.resolveTemplate('product', data);
    }

    renderIngredientGroup (title, required, {ingredientLists}) {
        const lists = ingredientLists.filter((item => item.required === required));
        const content = lists.map(this.renderIngredientList, this).join('');
        return content ? this.resolveTemplate('ingredientGroup', {title, required, content}) : '';
    }

    renderIngredientList (data) {
        const id = data._id;
        data.content = data.ingredients?.map(this.renderIngredientItem.bind(this, id)).join('');
        if (!data.required) {
            data.content = this.renderEmptyItem(id) + data.content;
        }
        return this.resolveTemplate('ingredientList', data);
    }

    renderIngredientItem (list, data) {
        data.list = list;
        return this.resolveTemplate('ingredientItem', data);
    }

    renderEmptyItem (list) {
        return this.resolveTemplate('emptyIngredientItem', {list});
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onOrder () {
        if (this.front.isGuest()) {
            return this.front.trigger('action:auth');
        }
        if (this.validate()) {
            this.toggleLoader(true);
            this.getPendingOrder().done(this.onPendingOrder.bind(this));
        }
    }

    getPendingOrder () {
        const deferred = $.Deferred();
        this.front.ajaxQueue.post(this.getDataUrl('list'), {
            class: 'order',
            view: 'pending'
        }).done(({items}) => deferred.resolve(items[0]));
        return deferred;
    }

    onPendingOrder (order) {
        if (!order) {
            this.createOrder();
        } else if (order._state === 'draft') {
            this.createOrderItem(order._id);
        } else {
            this.waitOrder(order._id);
        }
    }

    createOrder () {
        this.front.ajaxQueue.post(this.getDataUrl('create'), {class: 'order'})
            .done(id => this.createOrderItem(id))
            .fail(this.onFailOrder.bind(this));
    }

    createOrderItem (order) {
        const data = {
            product: {links: this.id},
            quantity: this.find('[name="quantity"]').val(),
            ingredients: {links: this.getSelectedIngredientIds()}
        };
        const master = {
            class: 'order',
            id: order,
            attr: 'items'
        };
        this.front.ajaxQueue.post(this.getDataUrl('create'), {class: 'orderItem', master, data})
            .done(this.onCreateOrderItem.bind(this, order))
            .fail(this.onFailOrder.bind(this));
    }

    getSelectedIngredientIds () {
        return this.findSelectedIngredients().map((index, item) => item.value).get().filter(value => value);
    }

    findSelectedIngredients ($container = this.$container) {
        return $container.find('.ingredient-item-radio [name]:checked');
    }

    waitOrder (order) {
        this.showError('Ваш текущий заказ ожидает выполнения...');
        this.trigger('action:order', {order});
    }

    onCreateOrderItem (order) {
        this.toggleLoader(false);
        this.trigger('action:order', {order});
    }

    onFailOrder (data) {
        this.toggleLoader(false);
        this.showError(data.responseText);
    }

    onChange () {
        this.setTotalPrice(this.getTotalPrice());
    }

    setTotalPrice (value) {
        this.find('[data-id="totalPrice"]').html(value);
    }

    getTotalPrice () {
        let result = this.data.price;
        for (const item of this.findSelectedIngredients()) {
            const price = Number(item.dataset.price);
            if (!isNaN(price)) {
                result += price;
            }
        }
        return Front.roundPrice(result * this.getQuantity());
    }

    getQuantity () {
        return Number(this.find('[name="quantity"]').val());
    }

    validate () {
        const quantity = this.getQuantity();
        if (!Number.isInteger(quantity)) {
            return this.showError('Количество должно быть целым');
        }
        if (quantity < 1) {
            return this.showError('Количество должно быть больше 0');
        }
        const group = this.find('.ingredient-group[data-required="true"]');
        for (const list of group.find('.ingredient-list')) {
            if (!this.validateRequiredIngredient(list)) {
                return this.showError(`Не выбран обязательный ингредиент ${this.getIngredientListTitle(list)}`);
            }
        }
        for (const item of this.findSelectedIngredients()) {
            if (!this.validateIngredientStock(item, quantity)) {
                return this.showError(`Не хватает запаса ингредиента ${item.dataset.title}`);
            }
        }
        return true;
    }

    validateRequiredIngredient (list) {
        return this.findSelectedIngredients($(list)).length > 0;
    }

    validateIngredientStock (item, quantity) {
        const stock = Number(item.dataset.stock);
        return isNaN(stock) || stock >= quantity;
    }

    getIngredientListTitle (item) {
        return $(item).closest('.ingredient-list').children('.ingredient-list-head').html();
    }

    showError (message) {
        Jam.dialog.error(message);
    }
};