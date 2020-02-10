import './css/main.css'
import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css'
import Animate from 'animate.css/animate.min.css'
// import users from '../../data/users.json'
window.Vue = require('vue')

Vue.component('users', require('./components/users.vue').default)
Vue.component('modal', require('./components/modal.vue').default)

new Vue({
  el: '#app'
})
