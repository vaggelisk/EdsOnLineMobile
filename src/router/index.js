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

import {globalStore} from "../main.js"

Vue.use(Router);
Vue.use(VueCookies);

var router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      // beforeEnter: (to, from, next) => {
      //     const { uri } = to.query;
      //     if (uri != null && uri != '/') {
      //         next(false);
      //         router.push(uri);
      //     } else {
      //         next();
      //     }
      // },
      redirect: {
        name:"Login"
        //name: "Report"
      }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      // beforeEnter: (to, from, next) => {
      //       const { uri } = to.query;
      //       if (uri != null && uri != '/') {
      //           next(false);
      //           router.push(uri);
      //       } else {
      //           next();
      //       }
      //   },
    },
    {
      path: '/vessel-view/:vessel',
      name: 'Vessel View',
      component: VesselView,
      beforeEnter: (to, from, next) => {
            if (globalStore.selectedVessel=='') {
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
        if (globalStore.selectedVessel=='') {
            next(false);
            router.push('/dashboard');
        } else {
            next();
        }
    }
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
        if (globalStore.selectedVessel=='') {
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
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: Alerts,
    },
    {
      path: '/report',
      name: 'Report',
      component: DailyReport,
      beforeEnter: (to, from, next) => {
        if (globalStore.selectedVessel=='') {
            next(false);
            router.push('/dashboard');
        } else {
            next();
        }
    }
    }
  ]
});

router.beforeEach((to, from, next) => {  
  // console.log(window.$cookies.isKey('user'));
  // console.log('from ' +from.path);
  // console.log('before ' +to.path);
  if (to.path=='/login')
  {
    if (window.$cookies.isKey('user')) next('/dashboard');
    else next();
  }  
  else {
    if (!window.$cookies.isKey('user')) next('/login');
    else next();
  }
})


export default router;



