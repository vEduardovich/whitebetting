<template>
  <div class='broadcastPage'>
    <v-layout row wrap>
      <v-flex xs12 lg2>
        <img src='https://whitebetting.s3.amazonaws.com/game/logo/favicon.svg' class='mt-3' alt="wB" title="wB" width='100' height='62'/>
      </v-flex>
      <v-flex xs12 lg4>
        <h1 class='mt-1 grey--text text--darken-1' v-bind:class="{'mt-5 ml-4': $vuetify.breakpoint.lgAndUp}">Announcements</h1>
      </v-flex>
    </v-layout>

    <v-layout column wrap class='mt-4 mx-1' v-bind:class="[{'mt-5 ml-4': $vuetify.breakpoint.lgAndUp }]">
      <v-flex xs12 lg8 text-xs-left>
        <article class='grey--text text--darken-3'>
          <ul>
            <li><h3 class='blue--text text--darken-3 headline' style='display:inline-block;'>Ethereum Mainnet is now very unstable!</h3><p class='ml-3 dateFont float-right' style='display:inline-block;'>Mar 12, 2020</p></li>
            <li class='mt-3'>Many transactions are not being confirmed on Ethereum Mainnet.</li>
            <li class='mt-1'>So we've decieded to stop our wB temporarily. All stakes have been refunded.</li>
            <li class='mt-1'>And we are developing to reduce transaction fees. There will be big changes in the next version.</li>
            <li class='mt-1'>We will let you know when we restart wB via Telegram. We look forward to meet you again</li>
          </ul>          
          <ul class='mt-5'>
            <li><h3 class='blue--text text--darken-3 headline' style='display:inline-block;'>Release notes</h3><p class='ml-3 dateFont float-right' style='display:inline-block;'>Feb 6, 2020</p></li>
            <li class='mt-3'>1. We have updated a comment system.</li>
            <li class='mt-1'>- Now you can communicate anonymously without sign-in.</li>
            <li class='' ><img class='mt-2 imgBox' src='https://whitebetting.s3-us-west-1.amazonaws.com/board/announcements/2020-02-06_19-29-51.png' ></li>
            <li class='mt-3'>2. Modified UX</li>
            <li class='mt-1'>- It has changed from odds to scores</li>
            <li class='' ><img class='mt-2 imgBox' src='https://whitebetting.s3-us-west-1.amazonaws.com/board/announcements/2020-02-06_20-27-22.png' ></li>

            <li class='mt-3'>- It has changed from round to league</li>
            <li class='' ><img class='mt-2 imgBox' src='https://whitebetting.s3-us-west-1.amazonaws.com/board/announcements/2020-02-07_01-52-20.png' ></li>
            <li class='mt-1'>Please enjoy our game!</li>
          </ul>
          <ul class='mt-5'>
            <li><h3 class='blue--text text--darken-3 headline' style='display:inline-block;'>We've have major updates</h3><p class='ml-3 dateFont float-right' style='display:inline-block;'>Dec 27, 2019</p></li>
            <li class='mt-3'>1. We increased all odds of the matches.</li>
            <li class='mt-1'>- Now we provide the world's highest odds.</li>
            <li class='mt-1'>- These are higher than Betfair, Betway and BET365</li>
            <li class='mt-5'>2. Now you can exchange 100 WhiteToken for 1ETH.</li>
            <li class='' ><img class='mt-2 imgBox' src='https://whitebetting.s3-us-west-1.amazonaws.com/board/announcements/2019-12-27_14-55-45.png' ></li>
            <li class='mt-3'>3. We start to provide match information. You can make a strategic bet!</li>
            <li class='' ><img class='mt-2 imgBox' src='https://whitebetting.s3-us-west-1.amazonaws.com/board/announcements/2019-12-27_14-56-52.png' ></li>
            <li class='mt-3'>4. You can see the winning prize on Etherscan after the match finished.</li>
            <li class='mt-2'>- Click the below icon.</li>
            <li class='' ><img class='mt-2 imgBox' src='https://whitebetting.s3-us-west-1.amazonaws.com/board/announcements/2019-12-27_15-19-39.png' ></li>
            <li class='mt-2'>- There are all the transactions of the winning prize!</li>
            <li class='' ><img class='mt-2 imgBox' src='https://whitebetting.s3-us-west-1.amazonaws.com/board/announcements/2019-12-27_15-21-03.png' ></li>
          </ul>
          <ul class='mt-5'>
            <li><h3 class='blue--text text--darken-3 headline' style='display:inline-block;'>The First 100 players bet to get up to 0.02ETH for free!!</h3><p class='ml-3 dateFont float-right' style='display:inline-block;'>Oct 30, 2019</p></li>
            <h4 class=' red--text'>This event has closed.</h4>
            <li class='mt-4'>We are WhiteBetting. We are the World's First Ethereum Football Betting Game!</li>
            <li>We prepared a new event.</li>
            <li class='mt-4'>The First 100 players bet to get up to 0.02ETH for free!!</li>
            <li class='mt-2' >1. Choose a match for your betting.</li>
            <li class='mt-2'  >2. Bet a game.</li>
            <li class='mt-2'  >3. Please send me your Ethereum address and the stake you bet through <a href="https://t.me/whitebettingOfficial" target="_blank" class='blue--text text--darken-3 ' style='text-decoration: underline;'>wB Telegram</a>. You will get up to 0.02ETH for free upon checking the info.</li>
            <li class='mt-2'  >- If your stake is lower than 0.02ETH you will get as much as you bet and if it's greater than or equal to 0.02ETH you will 0.02ETH.</li>
            <li>- You can apply only once for each Telegram account.</li>
            <li class='mt-2' >4. Now enjoy the moment until the match finish. You will be excited with the best odds provided in WhiteBetting.</li>
          </ul>
        </article>

      </v-flex>
    </v-layout>

		<!-- adding loading icon -->
		<!-- <Loading v-if='loadingStatus'/> -->

  </div>
</template>

<script>
import util from '@/commons/util';
const Util    = new util();
import { mapState } from 'vuex'
import mixinDataAnal from '@/commons/mixinDataAnal';
const isMobile = (window.innerWidth < 1264) ? true : false;

export default {
  name: 'Announcements',
  // components: { Loading },
  mixins: [mixinDataAnal],
  data () {
    return {
      isMobile : '',
      loader :{ gameList : false },
    }
  },
  methods : {

  },
  async created(){
    this.dataAnalysis(20101);

    this.deleteHelloDom();    
    Util.checkSession(this.$session, this.userAccount); // session 체크
    window.scrollTo(0,0); // 항상 페이지 최상단으로

  },
  beforeCreate(){ // 세션처리는 Toolbar에서 한다
  },
  computed : {
		...mapState([ // state는 computed에 넣는다
			'userAccount', 'loadingStatus',
    ]),
  },
  watch: {

  },
}
</script>

<style >
.broadcastPage{max-width: 850px;}
.dateFont{font-size:0.9em;}
.imgBox{max-width:80%;height:auto;box-shadow:0 2px 4px 0 rgba(0, 0, 0, 0.09), 0 2px 4px 0 rgba(0, 0, 0, 0.1);}
@media screen and (min-width:0px) and (max-width: 960px){
  .imgBox{max-width:100%;}
}
</style>

