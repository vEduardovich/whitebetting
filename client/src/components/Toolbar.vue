<template>
  <nav>
    <!-- 툴바의 height가 길어서 이걸 줄이다보니 반응형에 맞춰 조금 복잡해졌다 19.01.29 -->
    <v-toolbar color='pink darken-2 toolbar' app dark style='height:56px;'>
      <v-toolbar-side-icon v-on:click='drawer = !drawer;dataAnalysis(11100);' style='margin-top: -5px;' v-bind:class="{'mt-1': $vuetify.breakpoint.smAndDown }"></v-toolbar-side-icon>
      <router-link to='/' v-on:click.native='dataAnalysis(11101)' >
        <!-- <v-toolbar-title class='white--text' style='margin-top:-8px;'  v-bind:class="{'mt-0': $vuetify.breakpoint.smAndDown }"><img src='/bi.svg' width='30' height='18.6'/> White<strong class='titleBetting'>Betting</strong></v-toolbar-title> -->
        <v-toolbar-title class='white--text' style='margin-top:-8px;'  v-bind:class="{'mt-0': $vuetify.breakpoint.smAndDown }"><img src='https://whitebetting.s3.amazonaws.com/game/logo/bi.svg' width='30' height='18.6'/> White<strong class='titleBetting'>Betting</strong></v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>

      <a href='https://t.me/whitebettingOfficial' target='_blank' title='Communicate with Telegram'>
        <v-btn icon v-bind:class="{'ma-0 pa-0': $vuetify.breakpoint.xs}" v-on:click='dataAnalysis(11102)'>
          <v-icon size='24px' class='fab fa-telegram-plane'  style='margin-top:-5px;' v-bind:class="{'mt-0': $vuetify.breakpoint.smAndDown }"></v-icon>
        </v-btn>
      </a>

      <router-link v-if='userAccount' v-bind:to="'/user/'+ userAccount" title='Go to my betting history' v-on:click.native='dataAnalysis(11103)'>
      <!-- <a v-bind:href="'/user/'+ userAccount" target='_blank' title='Go to my betting history'>       -->
        <v-btn icon v-bind:class="{'ma-0 pa-0': $vuetify.breakpoint.xs}"  style='margin-top:-1px;' >
          <v-icon>account_circle</v-icon>
        </v-btn>
      <!-- </a> -->
      </router-link>

    </v-toolbar>

    <!-- <v-navigation-drawer v-model="drawer" mini-variant='true' class="blue lighten-3" dark app > -->
    <v-navigation-drawer v-model="drawer" class="blue lighten-3" dark app >
      <v-list>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>

        <v-list-tile v-for="(game, idx) in mainIcons" v-bind:key="game.title" router v-bind:to='game.route'  v-on:click.native='dataAnalysis(11201+idx)'>
          <v-list-tile-action>
            <v-img v-bind:class='game.ml' v-bind:src='game.src' v-bind:max-width='game.size'></v-img>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ game.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>


      <!-- 유럽리그 -->
        <v-list-tile v-for="(game, idx) in games" v-bind:key="game.title" router v-bind:to='game.route'  v-on:click.native='dataAnalysis(11301+idx)'>
          <v-list-tile-action >
            <v-img v-bind:class='game.ml' v-bind:src='game.src' v-bind:max-width='game.size'></v-img>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ game.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      <!-- <v-list-group
        value="true"
      >
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>LEAGUES</v-list-tile-title>
          </v-list-tile>
        </template>

        <v-list-tile v-for="(game) in games" v-bind:key="game.title" router v-bind:to='game.route' color=''>
          <v-list-tile-action >

            <v-img v-bind:class='game.ml' v-bind:src='game.src' v-bind:max-width='game.size'></v-img>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ game.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list-group>       -->
      <!-- 끝 유럽리그 -->


      <!-- 게시판 -->
      <v-list-group
      >
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>COMMUNITIES</v-list-tile-title>
          </v-list-tile>
        </template>

        <v-list-tile v-for="(game, idx) in communitinesLists" v-bind:key="game.title" router v-bind:to='game.route' v-on:click.native='dataAnalysis(11401+idx)'>
          <v-list-tile-action >

            <!-- <v-img v-bind:class='game.ml' v-bind:src='game.src' v-bind:max-width='game.size'></v-img> -->
            <!-- <v-icon v-bind:class='game.icon' v-bind:style='game.size'></v-icon> -->
            <v-icon v-bind:style='game.size'>{{game.icon}}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ game.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list-group>

      </v-list>
    </v-navigation-drawer>

  </nav>

</template>

<script>
// import Vue from 'vue'
import * as Contract from '@/web3/web3_contract';

import gameAPI from '@/commons/gameAPI';
import GameData from '@/commons/gameData';
import util from '@/commons/util';
import web3client from '@/web3/web3_client';
import mixinDataAnal from '@/commons/mixinDataAnal';
const GameAPI    = new gameAPI();
const Web3Client = new web3client();
const Util       = new util();
import { mapState, mapActions } from 'vuex'
import Web3  from 'web3';

const drawer = (window.innerWidth < 1264) ? false : true;// 왼쪽 툴바PC에서만 항상 보이기
const isMobile = (window.innerWidth < 1264) ? true : false;

export default {
  mixins: [mixinDataAnal],
  data () {
    return {
      drawer : drawer,
      // mainLists : GameData.mainToolbarLists,
      mainIcons : GameData.mainToolbarLists,
      communitinesLists : GameData.communitinesToolbarLists,
      // league: GameData.toolbarLeague,
      games: GameData.leagueToolbarLists,
      userObj_id : '',
    }
  },
  methods : {
    ...mapActions([ // 주의! actions는 methods에 넣는다.
      'vuexIsWeb3', 'vuexUserAccount', 'vuexContractInfo', 'vuexMyETH', 'vuexWhite', 'vuexIsWalletLogin', 'vuexIsShowWallet' ,
    ]),

    _isShowWallet(isWallet, isWalletLogin) {
      const isShowWallet = { trust : '', metaMask : '', getMetamask : '',}
      if (isWallet){ // 만약 지갑이 있다면
        if ( isWalletLogin && isMobile ){ // 지갑에 로그인 되어 있고 모바일이라면 아무것도 보여주지 X
          isShowWallet.trust       = false;
          isShowWallet.metaMask    = false;
          isShowWallet.getMetamask = false;
        } else if ( isWalletLogin  && !isMobile ) { // 로그인 되어 있고 PC라면 아무것도 보여주지 X
          isShowWallet.trust       = false;
          isShowWallet.metaMask    = false;
          isShowWallet.getMetamask = false;
        } else if( !isWalletLogin && isMobile ) { // 로그인X 모바일이라면 trust wallet을 보여주고
          isShowWallet.trust       = true;
          isShowWallet.metaMask    = false;
          isShowWallet.getMetamask = false;
        } else { // 로그인X PC라면 메타마스크를 보여준다.
          isShowWallet.trust       = false;
          isShowWallet.metaMask    = true;
          isShowWallet.getMetamask = false;// 인스톨 링크를 보여주지 않는다.
        }
      } else { // 그렇지 않고 만약 지갑이 없다면
        if ( isMobile ) { // 모바일이라면 trust wallet을 보여주고
          isShowWallet.trust       = true;
          isShowWallet.metaMask    = false;
          isShowWallet.getMetamask = false;
        } else { // PC라면 메타마스크를 보여준다.
          isShowWallet.trust       = false;
          isShowWallet.metaMask    = true;
          isShowWallet.getMetamask = true;
        }
      }
      this.vuexIsShowWallet(isShowWallet);
    },
    async _getWalletInfo(web3js) {
      const myETH= await Web3Client.getBalance( this.userAccount, web3js ); // 내 balance 가져오기
      this.vuexMyETH(myETH);
      const isTrustWallet = await Web3Client.checkTrustWallet(); // trust wallet이 있는지 체크
      const isMetaMask    = Web3Client.checkMetaMask(this.userAccount, isTrustWallet); // 메타마스크 체크
      const isWalletLogin = Web3Client.checkWallet(isTrustWallet, isMetaMask); // 지갑은 있으나 로그인이 되었는지 체크

      this.vuexIsWalletLogin(isWalletLogin);
      this._isShowWallet(this.isWeb3, this.isWalletLogin);// 지갑문구 어떤걸 보여줄지 결정
    },

    async _checkAccount(web3js){
      // 만약 web3가 있다면 로그인 유무는 모르겠지만 설치는 되어있다는 뜻이고
      // 없다면 아예 지갑 설치가 안되어 있다는 뜻
      const isWeb3 = (typeof web3 !== 'undefined') ? true : false; // 지갑(web3)이 설치되어 있는지 확인.
      this.vuexIsWeb3( isWeb3 ); // isWeb3를 vuex에 저장.

      // 유저가 바뀔때마다 새로 처리. 이것으로 eventListener에러처리 완료. 19.10.13
      let account;
      if(web3js){
        account = web3js.eth.accounts[0];
        if (web3js.eth.accounts[0] !== account) {
          account = web3js.eth.accounts[0];
        }
      }

      const userAccount  = await Web3Client.getAccount(web3js); // userAccount 가져오기
      // console.log('userAccount: '+ userAccount);
      Util.checkSession(this.$session, userAccount); // session 체크
      if ( this.userAccount != userAccount ){ // 계정이 달라졌다면
        // Util.checkSession(this.$session, userAccount); // session 체크
        const myWhite = await GameAPI.getUserWhite(userAccount); // white 정보를 가져오자
        const white = (myWhite) ? myWhite : 0;
        this.vuexWhite(white);
      }
      this.vuexUserAccount( userAccount ); // vuex에 userAccount 저장
      if (isWeb3){ // 위에서 구한 userAccount를 이용해 wallet정보를 구한다. 즉 위 if문 안으로 넣으면 안된다.
        await this._getWalletInfo(web3js); // wallet과 contract 정보 가져오기.
      } else {
        this._isShowWallet(isWeb3, false );
      }

    }
  },
  computed : {
		...mapState([ // state는 computed에 넣는다
			'userAccount', 'isWeb3', 'contractInfo', 'myETH', 'white', 'isWalletLogin', 'isShowWallet',
		]),
  },

  async created () {
    // 모든 userAccount와 contract정보와 ETH, 지갑유무, 어떤 지갑인지 확인하는 모듈을 setInterval로 넣는다.

    const isWeb3 = (typeof web3 !== 'undefined') ? true : false; // 지갑(web3)이 설치되어 있는지 확인.
    let web3js;
    if (isWeb3 ){ // 브라우저에 메타마스크(혹은 미스트)가 있는지 확인
      web3js = new Web3(web3.currentProvider); // 있다면 메타마스크를 쓰자.
    }

    // 모든 페이지가 열릴때 account를 체크하기 때문에
    await this._checkAccount(web3js); // 로그인 유무 확인

    if (!isMobile){ // 모바일은 5초마다 체크할 필요없다.
      const checkSignInInterval = setInterval(async ()=> { // 로그인 유무 3초마다 확인
        await this._checkAccount(web3js);
      }, 3000);
    }
  }

}
</script>

<style >
::selection {color: #295DAC;background: #F8BBD0;}
.v-icon .material-icons .theme--dark{width:30px !important;}

</style>

<style scoped>
.titleBetting{color:#ff0;text-shadow:0 1px 1px #c0c0c0;}
.v-toolbar__content{padding:0;height:56px;}

@media screen and (min-width:0px) and (max-width: 960px){
}
</style>
<style>

</style>