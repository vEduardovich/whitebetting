// 포기하지 않는 자에게 꿈은 반드시 찾아온다.
// 나는 세계를 바꿀 것이다. 다음 시대, 다음 흐름, 다음 인류의 창조자가 될 것이다.

import Vue from 'vue'
import './plugins/axios'
import 'babel-polyfill'
import './plugins/vuetify'

import App from './App.vue'
import router from './router'
import moment from 'moment'
import store from './store'
import VueSession from 'vue-session'
import VueCarousel from '@chenfengyuan/vue-carousel'// 경기화면에서 매치정보 터치 스크롤
import SocialSharing from 'vue-social-sharing';// facebook용 social button 만들기위해
// import VueCarousel from 'vue-carousel';

var options = { persist: true }
Vue.use(VueSession, options)
// Vue.use(VueCarousel_Announcements);
Vue.use(VueCarousel);
Vue.use(SocialSharing);


Vue.prototype.$moment = moment
// moment.locale('ko')// 모멘트 언어설정

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
