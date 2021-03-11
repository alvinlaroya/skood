import Vue from 'vue'
import store from './store'
import VueRouter from 'vue-router'
/* import Home from './views/Home.vue' */
import Login from './views/account/Login.vue'
import SignUp from './views/account/Signup.vue'
import Dashboard from './views/Dashboard.vue'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'

import SelectedRestaurant from './components/SelectedRestaurant.vue'
import SelectedTag from './components/SelectedTag.vue'

import Restaurant from './views/overview/Restaurant.vue'
import RestaurantsInvoice from './views/overview/RestaurantsInvoice.vue'

import Orders from './views/item/Order.vue'

import MyAccount from './views/usermanagement/MyAccount.vue'
import DriverVerification from './views/usermanagement/DriverVerification.vue'
import RiderRegistration from './views/usermanagement/RiderRegistration.vue'
import EmployeeRegistration from './views/usermanagement/EmployeeRegistration.vue'

import ChatSupport from './views/support/ChatSupport.vue'

import RemitRider from './views/remit/RemitRider.vue'
import RemitVerification from './views/remit/RemitVerification.vue'

import RestaurantManagement from './views/others/RestaurantManagement.vue'
import MenuManagement from './views/others/MenuManagement.vue'
import Tags from './views/others/Tags.vue'

import Breakfast from './views/categories/Breakfast.vue'


import TrackRider from './components/TrackRIder.vue'

import GenerateInvoice from './views/generate_invoice/GenerateInvoice.vue'

import * as firebase from 'firebase/app';
import 'firebase/auth';

/* import { db } from './firebase'; */

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: {
      name: "Login"
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if(store.state.authenticated == true) {
        //
      } else {
        next();
      }
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    components: {
        default: Dashboard,
        navbar: Navbar, // this will be the name navbar attribute for router-view component in App.vue
        sidebar: Sidebar // this will be the name sidebar attribute for router-view component in App.vue
    },
   /*  meta: {requiresAuth: true}, */
    beforeEnter: (to, from, next) => {
      if(store.state.isAdmin === true) {
        next();
      } else {
        next(false);
      }
    }
  },

  {
    path: '/overview/restaurant',
    name: 'Restaurant',
    components: {
      default: Restaurant,
      navbar: Navbar,
      sidebar: Sidebar
  },
    meta: {requiresAuth: true}
  },
  {
    path: '/overview/restaurants_invoice',
    name: 'RestaurantsInvoice',
    components: {
      default: RestaurantsInvoice,
      navbar: Navbar,
      sidebar: Sidebar
  },
    meta: {requiresAuth: true}
  },

  {
    path: '/food/orders/',
    name: 'Orders',
    components: {
      default: Orders,
      navbar: Navbar,
     /*  sidebar: Sidebar */
  },
    meta: {requiresAuth: true},
    beforeEnter: (to, from, next) => {
      if(store.state.isDispatcher === true) {
        next();
      } else {
       /*  next('/food/orders'); */
       next();
      }
    }
  },


  {
    path: '/management/my_account',
    name: 'MyAccount',
    components: {
      default: MyAccount,
      navbar: Navbar,
      sidebar: Sidebar
  },
    meta: {requiresAuth: true}
  },

  {
    path: '/management/driver_verification',
    name: 'DriverVerification',
    components: {
      default: DriverVerification,
      navbar: Navbar,
      sidebar: Sidebar
  },
    meta: {requiresAuth: true}
  },
  {
    path: '/management/rider_registration',
    name: 'RiderRegistration',
    components: {
      default: RiderRegistration,
      navbar: Navbar,
      sidebar: Sidebar
  },
    meta: {requiresAuth: true}
  },
  {
    path: '/management/employee_registration',
    name: 'EmployeeRegistration',
    components: {
      default: EmployeeRegistration,
      navbar: Navbar,
      sidebar: Sidebar
  },
    meta: {requiresAuth: true}
  },

  {
    path: '/support/chat',
    name: 'ChatSupport',
    components: {
      default: ChatSupport,
      navbar: Navbar,
      sidebar: Sidebar
  },
    meta: {
      requiresAuth: true,
      isChatSupport: true
    }
  },
  
  {
    path: '/remit/remit_rider',
    name: 'RemitRider',
    components: {
        default: RemitRider,
        navbar: Navbar,
        sidebar: Sidebar
    },
      meta: {requiresAuth: true}
  },
  {
    path: '/remit/remit_verification',
    name: 'RemitVerification',
    components: {
        default: RemitVerification,
        navbar: Navbar,
        sidebar: Sidebar
    },
      meta: {requiresAuth: true}
  },


  {
    path: '/others/restaurant_management',
    name: 'RestaurantManagement',
    components: {
      default: RestaurantManagement,
      navbar: Navbar,
      sidebar: Sidebar
  },
    meta: {requiresAuth: true}
  },
  {
    path: '/others/menu_management',
    name: 'MenuManagement',
    components: {
      default: MenuManagement,
      navbar: Navbar,
      sidebar: Sidebar
  },
    meta: {requiresAuth: true}
  },
  {
    path: '/others/tags',
    name: 'Tags',
    components: {
      default: Tags,
      navbar: Navbar,
      sidebar: Sidebar
  },
    meta: {requiresAuth: true}
  },

  {
    path: '/categories/breakfast',
    name: 'Breakfast',
    components: {
      default: Breakfast,
      navbar: Navbar,
      sidebar: Sidebar
  },
    meta: {requiresAuth: true}
  },

  {
    path: '/components/selectedRestaurant/:id',
    name: 'SelectedRestaurant',
    components: {
      default: SelectedRestaurant,
      navbar: Navbar,
      sidebar: Sidebar
  },
    meta: {requiresAuth: true}
  },
  {
    path: '/components/selectedTag/:id',
    name: 'SelectedTag',
    components: {
      default: SelectedTag,
      navbar: Navbar,
      sidebar: Sidebar
  },
    meta: {requiresAuth: true}
  },

  {
    path: '/generate_invoice/generateInvoice/:id',
    name: 'GenerateInvoice',
    components: {
      default: GenerateInvoice,
  },
    meta: {requiresAuth: true}
  },

  {
    path: '/components/trackRider/:id',
    name: 'TrackRider',
    components: {
      default: TrackRider,
  },
    meta: {requiresAuth: true}
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
/*   var loggedIn = false */
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  var isAuthenticated = firebase.auth().currentUser;
  if(requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }


  
  
})

export default router
