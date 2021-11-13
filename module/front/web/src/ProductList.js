
Front.ProductList = class ProductList extends Front.Loadable {

    constructor () {
        super(...arguments);
        this.noItemsFound = 'Продукты не найдены';
    }

    init () {
        super.init();
        this.createPagination();
        this.load();
    }

    createPagination () {
        this.pageSize = 9;
        this.pagination = new Front.Pagination(this);
        this.pagination.pageSize = this.pageSize;
        this.on('change:pagination', this.onChangePagination.bind(this));
    }

    getUrl (action = 'list') {
        return super.getUrl(action);
    }

    getPostData () {
        return {
            class: 'product',
            view: 'publicList',
            start: this.pagination.getOffset(),
            length: this.pagination.getPageSize()
        };
    }

    onChangePagination () {
        this.load();
    }

    onDone (data) {
        super.onDone(data);
        this.pagination.setTotal(data?.totalSize);
        this.$content.append(this.pagination.render());
        Jam.t(this.$container);
    }

    render (data) {
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        return items
            ? this.resolveTemplate('list', {items})
            : this.resolveTemplate('error', {text: Jam.t(this.noItemsFound)});
    }

    renderItem (data) {
        data.authorTitle = data.author?._title;
        data.content = Front.escapeHtml(data.content);
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }
};