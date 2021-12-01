'use strict';

Vue.mixin({
    data () {
        return {
            loading: false
        };
    },
    computed: {
        isGuest () {
            return !this.$root.userId;
        }
    },
    mounted () {
        this.translateElement();
    },
    updated () {
        this.translateElement();
    },
    methods: {
        getDataUrl (action) {
            return `${this.$root.dataUrl}/${action}`;
        },
        getThumbnailUrl (id, size = 'sm') {
            return `${this.$root.thumbnailUrl}&s=${size}&id=${id}`;
        },
        getRefArray (name) {
            const data = this.$refs[name];
            return Array.isArray(data) ? data : data ? [data] : [];
        },
        toOrder () {
            this.$root.$emit('order', ...arguments);
        },
        toOrders () {
            this.$root.$emit('orders', ...arguments);
        },
        toProduct () {
            this.$root.$emit('product', ...arguments);
        },
        toProducts () {
            this.$root.$emit('products');
        },
        fetchJson () {
            return this.fetchByMethod('getJson', ...arguments);
        },
        fetchText (url, data) {
            return this.fetchByMethod('getText', ...arguments);
        },
        fetchByMethod (name, action, data) {
            try {
                const csrf = this.$root.csrf;
                this.loading = true;
                return (new Jam.Fetch)[name](this.getDataUrl(action), {csrf, ...data});
            } finally {
                this.loading = false;
            }
        },
        requireAuth () {
            if (this.isGuest) {
                location.assign(this.$root.authUrl);
                return false;
            }
            return true;
        },
        translateElement () {
            Jam.i18n.translate($(this.$el));
        },
        showError () {
            Jam.dialog.error(...arguments);
        }
    }
});

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