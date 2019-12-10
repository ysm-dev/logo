import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/database'
import VueFire from 'vuefire'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.use(VueFire)
!firebase.apps.length &&
  firebase.initializeApp({
    apiKey: 'AIzaSyDJ4qZYsONCZBiMMx8l1w76qMK3jSUbmIo',
    databaseURL: 'https://io-live.firebaseio.com/',
  })
Vue.config.productionTip = false

Vue.use(Antd)

Vue.mixin({
  transition: {
    mode: 'out-in',
    enterActiveClass: 'fade-enter-active',
    leaveActiveClass: 'fade-leave-active',
    appearActiveClass: 'fade-enter-active',
  },
})
