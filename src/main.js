import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import axios from 'axios'

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
        type:'',
        faults:[],
        dashboard:{},
        mapData:[],
        chartData:{},
        mapDate:'',
        alertFilters: [],
        alerts:[
            // {
            //   Id:1,
            //   Vessel:'Energy Triumph',
            //   Engine:'Energy Triumph ME',
            //   Component:'Cylinder 4',
            //   Subsystem:'Servo Oil',
            //   Fault:'Fault 5',
            //   Date:'2019/03/05'
            // },
            // {
            //   Id:2,
            //   Vessel:'Energy Triumph',
            //   Engine:'Energy Triumph ME',
            //   Component:'Cylinder 2',
            //   Subsystem:'Fuel Injection',
            //   Fault:'Fault 3',
            //   Date:'2019/01/23'
            // },
            // {
            //   Id:3,
            //   Vessel:'Energy Triumph',
            //   Engine:'Energy Triumph ME',
            //   Component:'Cylinder 6',
            //   Subsystem:'Exhaust Gas',
            //   Fault:'Fault 1',
            //   Date:'2019/01/12'
            // },
            // {
            //   Id:4,
            //   Vessel:'Energy Triumph',
            //   Engine:'Energy Triumph ME',
            //   Component:'Cylinder 6',
            //   Subsystem:'Exhaust Gas',
            //   Fault:'Fault 4',
            //   Date:'2019/01/12'
            // }
        ],
        validDate:false,
        checkedDate:false
    },
    created()
    {
    }
});

new Vue({
    render: h => h(App),
    router
}).$mount('#app')


