'use strict';

const front = new Vue({
    el: '#front',
    props: {
        csrf: String,
        authUrl: String,
        dataUrl: String,
        thumbnailUrl: String,
        userId: String
    },
    propsData: {
        ...document.querySelector('#front').dataset
    },
    data () {
        return {
            activePage: 'products',
            activeOrder: null,
            activeProduct: null
        };
    },
    computed: {
        activePageProps () {
            switch (this.activePage) {
                case 'order': return {
                    key: this.activeOrder,
                    order: this.activeOrder
                };
                case 'product': return {
                    key: this.activeProduct,
                    product: this.activeProduct
                };
            }
        }
    },
    created () {
        this.$on('products', this.onProducts);
        this.$on('product', this.onProduct);
        this.$on('orders', this.onOrders);
        this.$on('order', this.onOrder);
    },
    methods: {
        onProducts () {
            this.activePage = 'products';
        },
        onProduct (id) {
            this.activePage = 'product';
            this.activeProduct = id;
        },
        onOrders () {
            if (this.requireAuth()) {
                this.activePage = 'orders';
            }
        },
        onOrder (id) {
            if (this.requireAuth()) {
                this.activePage = 'order';
                this.activeOrder = id;
            }
        }
    }
});