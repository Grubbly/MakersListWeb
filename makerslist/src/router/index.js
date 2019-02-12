import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import AddList from '@/components/AddList'
import EditList from '@/components/EditList'
import Signup from '@/components/auth/Signup'
import Login from '@/components/auth/Login'
import ViewProfile from '@/components/profile/ViewProfile'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/add-list',
      name: 'AddList',
      component: AddList
    },
    {
      path: '/edit-list/:list_slug',
      name: 'EditList',
      component: EditList
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/profile/:id',
      name: 'ViewProfile',
      component: ViewProfile,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to,from,next) => {
  // to = destination
  // from = current location
  // next = function used to say where to go next
  // Check if auth is req for route
  if(to.matched.some(rec => rec.meta.requiresAuth)) {
    let user = firebase.auth().currentUser
    if(user) {
      // user sign in, go to route
      next()
    } else {
      next({name: 'Login'})
    }
  } else {
    next()
  }
})

export default router