
Front.Order = class Order extends Front.Loadable {

    init () {
        super.init();
        this.addActionHandler('addMore', this.onAddMore);
        this.addActionHandler('confirmOrder', this.onConfirmOrder);
        this.addActionHandler('deleteItem', this.onDeleteItem);
        this.addActionHandler('deleteOrder', this.onDeleteOrder);
        this.addActionHandler('modifyOrder', this.onModifyOrder);
    }

    addActionHandler (name, method) {
        this.on('click', `[data-action="${name}"]`, method.bind(this));
    }

    getUrl (key = 'read') {
        return super.getUrl(key);
    }

    getPostData () {
        return {
            class: 'order',
            view: 'withItems',
            id: this.id
        };
    }

    render (data) {
        this.data = data;
        data.state = data._state_title;
        data.created = Jam.FormatHelper.asDatetime(data._createdAt);
        data.hasItems = data.items.length > 0;
        data.items = data.items.map(this.renderItem, this).join('');
        return this.resolveTemplate('order', data);
    }

    renderItem (data) {
        return this.resolveTemplate('item', {
            id: data._id,
            name: data.product.name,
            picture: data.product.picture,
            quantity: data.quantity,
            ingredients: data.ingredients.map(this.renderIngredient, this).join('') || '-'
        });
    }

    renderIngredient (data) {
        return this.resolveTemplate('ingredient', {
            name: data.name
        });
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onAddMore () {
        this.front.trigger('show:page', {name: 'main'});
    }

    onConfirmOrder () {
        this.transitOrder('confirm');
    }

    onModifyOrder () {
        this.transitOrder('modify');
    }

    transitOrder (transition) {
        this.toggleLoader(true);
        return this.front.ajaxQueue.post(this.getUrl('transit'), {
            class: 'order',
            id: this.id,
            transition
        }).fail(this.onFailOrder.bind(this))
          .done(() => {
              this.toggleLoader(false);
              this.load();
          });
    }

    onDeleteItem (event) {
        const id = $(event.currentTarget).closest('[data-id]').data('id');
        Jam.dialog.confirmDeletion('Remove this item from the order?').then(this.deleteItem.bind(this, id));
    }

    deleteItem (id) {
        this.toggleLoader(true);
        this.front.ajaxQueue.post(this.getUrl('delete'), {class: 'orderItem', id})
            .fail(this.onFailOrder.bind(this))
            .done(() => {
                this.toggleLoader(false);
                this.load()
            });
    }

    onDeleteOrder () {
        Jam.dialog.confirmDeletion('Delete this order permanently?').then(this.deleteOrder.bind(this));
    }

    deleteOrder () {
        this.toggleLoader(true);
        this.front.ajaxQueue.post(this.getUrl('delete'), {
            class: 'order',
            id: this.id
        }).done(() => {
            this.toggleLoader(false);
            this.front.showPage('orders');
        }).fail(this.onFailOrder.bind(this));
    }

    onFailOrder (data) {
        this.toggleLoader(false);
        Jam.dialog.error(data.responseText);
    }
};