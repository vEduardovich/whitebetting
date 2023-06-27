import Vue from 'vue'
import Router from 'vue-router'
// import Main from '@/views/Main.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes : [
    {
      path: '/',
      name: 'Main',
      // component : Main,
      component: () => import('@/views/Main.vue')
    // }, { // :userAccount가 없을때를 처리하고 싶다면 이렇게 하나 더 추가해야한다 ;;
    //   path: '/user',
    //   name: 'user',
    //   component: () => import('@/views/User.vue')
    }, {
      path: '/football/:fixtureId',
      name: 'football',
      component: () => import('@/views/Football.vue')
    }, {
      path: '/user/:userAccount',
      name: 'User',
      component: () => import('@/views/User.vue')
    }, {
      path: '/list/inplayMatches',
      name: 'InplayMatches',
      component: () => import('@/views/MatchList.vue')
    }, {
      path: '/list/finishedMatches',
      name: 'FinishedMatches',
      component: () => import('@/views/MatchList.vue')
    }, {      
      path: '/group/:name',
      name: 'List',
      component: () => import('@/views/List.vue')
    }
    , {
      path: '/info/howtobet',
      name: 'Guide',
      component: () => import('@/views/Guide.vue')
    },
    , {
      path: '/info/announcements',
      name: 'Announcements',
      component: () => import('@/views/Announcements.vue')
    },
    , {
      path: '/info/:name',
      name: 'Info',
      component: () => import('@/views/Info.vue')
    },
    , {
      path: '/hotcomments',
      name: 'CommentMain',
      component: () => import('@/views/Comment.vue')
    },    
    , {
      path: '/hotcomments/:pageNum',
      name: 'Comment',
      component: () => import('@/views/Comment.vue')
    },    
    // { path: '*', redirect: '/' }, // catch all use case
  ]

})
