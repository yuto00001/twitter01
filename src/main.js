import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from "firebase/app"
import "firebase/auth";
import {firebaseConfig} from '@/config/local.js'

Vue.config.productionTip = false
firebase.initializeApp(firebaseConfig)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
