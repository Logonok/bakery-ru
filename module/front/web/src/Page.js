
Front.Page = class Page extends Front.Element {

    init () {
        this.name = this.getData('page');
        this.front.on('show:page', this.onPage.bind(this));
    }

    onPage (event, data) {
        if (this.name === data.name) {
            this.activate(data);
        }
    }

    activate () {
        this.front.togglePage(this.name);
    }

    showPage () {
        this.front.showPage(this.name, ...arguments);
    }
};

Front.MainPage = class MainPage extends Front.Page {
};

Front.ProductPage = class ProductPage extends Front.Page {

    init () {
        super.init();
        this.product = this.getHandler('Product');
        this.front.on('action:product', this.onProduct.bind(this));
    }

    onProduct (event, {product}) {
        this.showPage();
        this.product.setInstance(product);
    }
};

Front.OrdersPage = class OrdersPage extends Front.Page {

    init () {
        super.init();
        this.list = this.getHandler('OrderList');
        this.front.on('action:orders', this.onOrders.bind(this));
    }

    activate () {
        super.activate();
        this.list.load();
    }

    onOrders () {
        this.showPage();
    }
};

Front.OrderPage = class OrderPage extends Front.Page {

    init () {
        super.init();
        this.order = this.getHandler('Order');
        this.front.on('action:order', this.onOrder.bind(this));
    }

    onOrder (event, {order}) {
        this.showPage();
        this.order.setInstance(order);
    }
};