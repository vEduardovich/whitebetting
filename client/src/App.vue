<template>
  <v-app>
    
    <Toolbar />
    <v-content>
      <router-view></router-view>
    </v-content>
    <Footer />

  </v-app>
</template>

<script>
import Toolbar from '@/components/Toolbar'
import Footer from '@/components/Footer'

export default {
  name: 'App',
  components: { Toolbar, Footer },
  data () {
    return {
      //
    }
  }
}
</script>

<style>
/* css 초기화 */
a { color: #000; text-decoration: none; }
a:hover, a:focus{text-decoration: none; }
ul, li{list-style: none;margin:0px;padding:0px;}
p{margin:0;}
header{height:50px;}

button {background: none; border: 0; color: inherit; font: inherit; line-height: normal;overflow: visible;padding: 0;}
body{font-family:Georgia, times, 'NanumGothic', serif, '맑은 고딕';font-size: 1.0em;}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
/* v-btn안에서 모든 문자가 대문자로 나오는거 수정 */
/* *{ text-transform: none !important; text-transform: none !important; } */
</style>
