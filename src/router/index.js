import Vue from 'vue'
import Router from 'vue-router'
import VueCookies from 'vue-cookies'

import Dashboard from '../screens/Dashboard'
import VesselView from '../screens/VesselView'
import EngineFaults from '../screens/EngineFaults'
import EnginePerformance from '../screens/EnginePerformance'
import UserSettings from '../screens/UserSettings'
import Register from '../screens/Register'
import Login from '../screens/Login'
import Alerts from '../screens/Alerts'
import DailyReport from '../screens/DailyReport'
import FaultsHistory from '../screens/FaultsHistory'
import EngineFaultDetail from '../screens/EngineFaultDetail'

import {globalStore} from "../main.js"

Vue.use(Router);
Vue.use(VueCookies);

var router = new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            redirect: {
                name: "Login"
            }
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard,
        },
        {
            path: '/vessel-view/:vessel',
            name: 'Vessel View',
            component: VesselView,
            beforeEnter: (to, from, next) => {
                if (globalStore.selectedVessel == '') {
                    next(false);
                    router.push('/dashboard');
                } else {
                    next();
                }
            }
        },
        {
            path: '/engine-faults/',
            name: 'Engine Faults',
            component: EngineFaults,
            children: [
                {
                    path: ':id',
                    component: EngineFaults,
                    name: ''
                },

            ],
            beforeEnter: (to, from, next) => {
                if (globalStore.selectedVessel == '') {
                    next(false);
                    router.push('/dashboard');
                } else {
                    next();
                }
            }
        },
        {
            path: '/engine-fault-detail',
            name: 'Engine Fault Detail',
            component: EngineFaultDetail,
        },
        {
            path: '/faults-history/:id',
            name: 'Faults History',
            component: FaultsHistory
        },
        {
            path: '/engine-performance',
            name: 'Engine Performance',
            component: EnginePerformance,
            beforeEnter: (to, from, next) => {
                if (globalStore.selectedVessel == '') {
                    next(false);
                    router.push('/dashboard');
                } else {
                    next();
                }
            }
        },
        {
            path: '/user-settings',
            name: 'Settings',
            component: UserSettings
        },
        {
            path: '/login',
            name:
                'Login',
            component: Login,
        },
        {
            path: '/register',
            name:
                'Register',
            component: Register,
        },
        {
            path: '/alerts',
            name:
                'Alerts',
            component: Alerts,
        },
        {
            path: '/report',
            name:
                'Report',
            component: DailyReport,
        }
    ]
});

router.beforeEach((to, from, next) => {
    let params = window.location.search.replace(/^\?/,'').split('&');

    if (params.length) {
        var vessel = new RegExp('^vessel');

        for (var i in params) {
            if (params.hasOwnProperty(i)) {
                if (vessel.test(params[i])) {
                    var param = params[i].replace(vessel,'').replace(/^=/,'');

                    window.$cookies.set('request-vessel', decodeURI(param));
                }
            }
        }
    }

    if (to.path == '/login') {
        if (window.$cookies.isKey('user')) next('/dashboard');
        else next();
    }
    else {
        if (!window.$cookies.isKey('user')) next('/login');
        else next();
    }
})


export default router;



