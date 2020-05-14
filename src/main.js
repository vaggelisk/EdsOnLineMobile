import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'

var MobileDetect = require('mobile-detect'),
    md = new MobileDetect(window.navigator.userAgent);

Vue.config.productionTip = false;
// Vue.prototype.$http = axios;

Vue.config.warnHandler = function (msg, vm, trace) {
};

export var globalStore = new Vue({
    data: {
        selectedVessel:'',
        selectedIMO:'',
        availableVessels:[],
        cylCount:0,
        tcCount:0,
        allowNav:true,
        userLogged:false,
        userProfile:{},
        signals:{},
        reference:{},
        mapping:{},
        ehcMapping:{},
        faultMapping:{},
        units:{},
        loadDiagram:{},
        limits:{},
        type:'last',
        faults:[],
        dashboard:{},
        mapData:{},
        chartData:{},
        mapDate:'',
        alertFilters: [],
        alerts:[],
        validDate:false,
        checkedDate:false,
        dateTo:''
    },
    methods: {
        is_mobile : function () {
            return md.mobile() != null;
        }
    },
    created(){}
});

new Vue({
    render: h => h(App),
    router
}).$mount('#app')


