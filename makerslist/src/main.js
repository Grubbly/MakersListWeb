// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import firebase from 'firebase'

Vue.config.productionTip = false
Vue.use(Vuetify)
import 'vuetify/dist/vuetify.min.css'

let app = null

/* eslint-disable no-new */
firebase.auth().onAuthStateChanged(() => {
  if(!app) {
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }
})
