<template>
  <v-footer class="mt-4 justify-center footerCommon"
    height="auto"
  >
    <v-layout column>
      <div class='mt-2 mb-1 footerInfo' >
        <p class='float-left' style='display:inline-block;'>
          <router-link v-bind:to='{path:`/info/howtobet`}' title='How to bet' class='pink--text text--darken-2 linkFont mx-1' v-on:click.native='dataAnalysis(12101)'>How to bet </router-link>
          | <router-link v-bind:to='{path:`/info/announcements`}' title='Announcements' class='pink--text text--darken-2 linkFont mx-1' v-on:click.native='dataAnalysis(12102)'>Announcements</router-link>
          |<router-link v-bind:to='{path:`/info/aboutwb`}' title='About wB' class='pink--text text--darken-2 linkFont mx-1' v-on:click.native='dataAnalysis(12103)'> About wB </router-link>
          |<router-link v-bind:to='{path:`/info/contactus`}' title='Contact us' class='pink--text text--darken-2 linkFont mx-1' v-on:click.native='dataAnalysis(12104)'> Contact us </router-link>|
        </p>
        <p class='float-left mt-2' style='display:inline-block;'>
          <router-link v-bind:to='{path:`/info/diary`}' title='Diary' class='pink--text text--darken-2 linkFont mx-1' v-on:click.native='dataAnalysis(12105)'> Diary</router-link>
          |<router-link v-bind:to='{path:`/info/termsofservice`}' title='Terms of service' class='pink--text text--darken-2 linkFont mx-1' v-on:click.native='dataAnalysis(12106)'> Terms of service </router-link>
        </p>
      </div>
      <div class='mt-2 mb-1 footerInfo' >
        <p class='float-left' style='display:inline-block;'>
          <a href="https://dappradar.com/app/1686/whitebetting" target="_blank" class='blue--text text--darken-3 ml-2' style='text-decoration: underline;' v-on:click='dataAnalysis(12201)'>
            <img src="https://whitebetting.s3-us-west-1.amazonaws.com/game/logo/dappRadar.png" style='height:25px;border:1px solid #aaa;border-radius:3px;padding:4px 10px;'>
          </a>
          <a href="https://www.dapp.com/dapp/whitebetting" target="_blank" class='blue--text text--darken-3 ml-2 linkFont' v-on:click='dataAnalysis(12202)' >
            <img src="https://whitebetting.s3-us-west-1.amazonaws.com/game/logo/dappCom.png" style='height:25px;border:1px solid #aaa;border-radius:3px;padding:3px 10px;' >
          </a>
          <a href="https://www.stateofthedapps.com/dapps/whitebetting" target="_blank" class='blue--text text--darken-3 ml-2' style='text-decoration: underline;'>
            <img src="https://whitebetting.s3-us-west-1.amazonaws.com/game/logo/stateOfTheDapps.svg" style='height:25px;border:1px solid #aaa;border-radius:3px;padding:4px 10px;' v-on:click='dataAnalysis(12203)'>
          </a>

          <a href="https://etherscan.io/address/0x07859fec7b937c695f1f807255cfc4a13c7b7138" target="_blank" title='Smart Contract' class='blue--text text--darken-3 ml-2 linkFont' style='text-decoration: underline;' v-on:click='dataAnalysis(12204)'>
            <img src="https://whitebetting.s3-us-west-1.amazonaws.com/game/logo/etherScan.png" style='height:25px;border:1px solid #aaa;border-radius:3px;padding:3px 10px;'>
          </a>
        </p>
      </div>
      <v-flex xs12 class='mt-1 mb-2'>
        <p class='footerInc'>Copyright © 2019-2020 White<span class='ci'>Betting</span> Inc. All rights reserved.</p>
      </v-flex>
    </v-layout>
      <!-- <address>
        <a href='mailto:ufo@whitebetting.com'><span class='footer' >ufo</span><span class='ci'>@</span><span class='footer' >white</span><span class='ci'>betting</span><span class='footer' >.com</span></a>
      </address> -->
    <!-- <div>
      &copy;2019<span class='ci'>Virlit, inc</span>Blow my mind!
    </div>     -->
  </v-footer>
</template>

<script>
import mixinDataAnal from '@/commons/mixinDataAnal';

export default {
  name : 'Footer',
  mixins: [mixinDataAnal],
  data () {
    return {
      // isMobile: (window.innerWidth < 560) ? true : false,
    }
  }
}
</script>

<style scoped>
/* .vcard{padding:2px;} */
/* .whiteTxt{ } */
.footerInfo{color:#333; font-style: thin;}
.footerInc{color:#666; font-style: thin;}
.ci{color:rgb(110, 110, 4);}
address{font-style: normal;}
.footerCommon{font-size:11px;}
/* .linkFont{text-decoration: underline;} */
</style>
