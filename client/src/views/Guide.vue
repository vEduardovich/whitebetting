<template>
  <div class='guidePage'>
    <v-layout row wrap>
      <v-flex xs12 lg2>
        <img src='https://whitebetting.s3.amazonaws.com/game/logo/favicon.svg' class='mt-3' width='100' height='62'/>
      </v-flex>
      <v-flex xs12 lg4>
        <h1 class='mt-1 grey--text text--darken-1' v-bind:class="{'mt-5 ml-4': $vuetify.breakpoint.lgAndUp}">How to bet</h1>
      </v-flex>
    </v-layout>

    <v-layout wrap class='mt-4 mx-1' v-bind:class="[{'mt-5 ml-4': $vuetify.breakpoint.lgAndUp }]">
      <v-flex xs12 lg12 text-xs-left class='mb-5'>
        <h3 class='mb-2 blue--text text--darken-3'>Getting Started</h3>
        <v-expansion-panel v-model="panel.started" expand >
          <v-expansion-panel-content  expand-icon="">
            <h4 slot="header">1. Install a wallet</h4>
            <v-card>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12 lg12 text-xs-left class='mb-3'>
                    <p>In order to play wB, you need to install a wallet. We recommend these.</p>
                  </v-flex>
                  <v-flex xs12 lg6 text-xs-left>
                    <h4><a href="https://metamask.io/" target="_blank" title="Go to MetaMask page" class="linkTxt">PC - MetaMask Extension</a></h4>
                    <a href="https://metamask.io/" target="_blank" title="Go to MetaMask page">
                      <img src="https://whitebetting.s3.amazonaws.com/game/guide/MetaMask.png" alt='MetaMask' class='my-3 walletImg'/>
                    </a>
                  </v-flex>
                  <v-flex xs12 lg6 text-xs-left>
                    <h4><a href="https://link.trustwallet.com/" target="_blank" title="Go to Trust Wallet page" class="linkTxt">Mobile - Trust Wallet</a></h4>
                    <a href="https://link.trustwallet.com/" target="_blank" title="Go to Trust Wallet page">
                      <img src="https://whitebetting.s3.amazonaws.com/game/guide/trustImg.png" alt='TrustWallet' class='my-3 trustImg'/>
                    </a>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

        </v-expansion-panel>
      </v-flex>


      <v-flex xs12 lg12 text-xs-left class='mb-5'>
        <h3 class='mb-2 blue--text text--darken-3'>Play the WhiteBetting</h3>
        <v-expansion-panel v-model="panel.guideBet" expand >
          <v-expansion-panel-content  expand-icon="">
            <h4 slot="header">1. Choose a match</h4>
            <v-card>
              <v-card-text class="">
                <p>① Choose a match that you want to bet.</p>
                <p>② If you want to check more available matches, you can click "Hot Matches".</p>
                <img src="https://whitebetting.s3.amazonaws.com/game/guide/1_choose_the_match.jpg" alt='Choose the match' class='my-3 ' style='width:100%;height:auto;' />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content expand-icon=''>
            <h4 slot="header">2. Bet a game</h4>
            <v-card>
              <v-card-text class=" lighten-3">
                <p>① As soon as you're on the page of the game, you can find the pop-up box of Metamask. You have to connect to bet your account with a wallet.</p>
                <img src="https://whitebetting.s3.amazonaws.com/game/guide/connect_wb.png" alt='Connect with wallet' class='my-3 ' style='max-width:100%;height:auto;'/>
                <p>① Choose a game that you want to bet.</p>
                <img src="https://whitebetting.s3.amazonaws.com/game/guide/2_select_the_game.jpg" alt='Select the game' class='my-3 ' style='max-width:100%;height:auto;' />
                <p>① Bet your ETH</p>
                <img src="https://whitebetting.s3.amazonaws.com/game/guide/3_bet_your_ether.jpg" alt='Bet your ether' class='my-3 ' />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content expand-icon=''>
            <h4 slot="header">3. Confirm the result</h4>
            <v-card>
              <v-card-text class=" lighten-3">
                <p>- You have to click "confirm" to bet.</p>
                <img src="https://whitebetting.s3.amazonaws.com/game/guide/6_confirm_your_betting.png" alt='Connect to bet' class='my-3' style='max-width:100%;height:auto;' />

                <p>① Waiting for Ethereum. Usually, it takes 12sec. ~ 10minutes.</p>
                <img src="https://whitebetting.s3.amazonaws.com/game/guide/5_waiting_for_ethereum.png" alt='Waiting for Ethereum' class='my-3' />
                <p>①, ② After the confirmation onto Mainnet, you can check your betting.</p>
                <img src="https://whitebetting.s3.amazonaws.com/game/guide/6_Check_your_betting.jpg" alt='Check your betting' class='my-3' style='max-width:100%;height:auto;' />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content expand-icon='theaters'>
            <h4 slot="header">Video</h4>
            <v-card>
              <v-card-text class=" lighten-3">
                <iframe width="100%" height="315"  src="https://www.youtube.com/embed/FH9zpi-g6zA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class='gameGuide' ></iframe>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>

      <v-flex xs12 lg12 text-xs-left class='mb-5'>
        <h3 class='mb-2 blue--text text--darken-3'>Get the winning Ether</h3>
        <v-expansion-panel v-model="panel.guideLogin" expand>
          <v-expansion-panel-content  expand-icon="">
            <h4 slot="header">1. Find Ether in your wallet.</h4>
            <v-card>
              <v-card-text class="">
                <p>- Check whether you win or not</p>
                <img src="https://whitebetting.s3.amazonaws.com/game/guide/6_game_over.png" alt='Check where you win or not' class='my-3' style='max-width:100%;height:auto;' />
                <p>①  If you win, you can find already the increased Ether in your wallet after the match. We give the prize Ether automatically. It will settle accounts in about 5 ~ 30 min after the match.</p>
                <img src="https://whitebetting.s3.amazonaws.com/game/guide/1_your_account.png" alt='Find Ether in your wallet' class='my-3' style='max-width:100%;height:auto;' />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content expand-icon=''>
            <h4 slot="header">2. Check the game which you've bet.</h4>
            <v-card>
              <v-card-text class=" lighten-3">
                <p>① You can visit your account page if you log in to your wallet.</p>
                <p>② On this page, you can see all the results of your betting.</p>
                <img src="https://whitebetting.s3.amazonaws.com/game/guide/bettingHistory.jpg" alt='Player betting history' class='my-3' style='max-width:100%;height:auto;' />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content expand-icon=''>
            <h4 slot="header">3. Check the internal transaction of smart contract on Etherscan.</h4>
            <v-card>
              <v-card-text class=" lighten-3">
                <p>① <a href="https://etherscan.io/address/0x07859fec7b937c695f1f807255cfc4a13c7b7138#internaltx" target="_blank" title="Go to Etherscan" >Visit to Ethercan.</a> This has all transactions of Ethereum.</p>
                <img src="https://whitebetting.s3.amazonaws.com/game/guide/1_etherscan.png" alt='Find Ether in your wallet' class='my-3' style='max-width:100%;height:auto;' />

              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

        </v-expansion-panel>
      </v-flex>


      <v-flex xs12 lg12 text-xs-left class='mb-5'>
        <h3 class='mb-2 blue--text text--darken-3'>Some rules what you should know.</h3>
        <v-expansion-panel v-model="panel.shouldKnow" expand>
          <v-expansion-panel-content  expand-icon="">
            <h4 slot="header">1. All bet types are based on what is happening in the normal time.</h4>
            <v-card>
              <v-card-text class="">
                <p>For example, a football match often includes a couple of minutes added time, making it last more than 90 minutes, which is normal time. The normal time, however, excludes extra time and penalties.</p>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content expand-icon=''>
            <h4 slot="header">2. We don't take more than we can pay.</h4>
            <v-card>
              <v-card-text class=" lighten-3">
                <p>You cannot bet more than we can pay. Our server automatically blocks it. So don't worry about it.</p>
                <img src="https://whitebetting.s3.amazonaws.com/game/guide/block_over_stake.png" alt='block over stake' class='my-2'/>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content expand-icon=''>
            <h4 slot="header">3. If a match is canceled, we will return all ETH to bettors</h4>
            <v-card>
              <v-card-text class=" lighten-3">
                <p>Typically within 24 hours</p>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

          <v-expansion-panel-content expand-icon=''>
            <h4 slot="header">4. If you have any trouble, please contact us at any time.</h4>
            <v-card>
              <v-card-text class=" lighten-3">
                <p>In case of transaction delays due to congestion in Ethereum network. So please contact us through Telegram or E-mail. We will response within at least 24 hours.</p>
                <br/>
                <p><a href='mailto:ufo@whitebetting.com' class='blue--text text--darken-3 ml-2' style='text-decoration: underline;'>ufo@whitebetting.com</a></p>
                <p class='mt-2'><a href="https://t.me/whitebettingOfficial" target="_blank" class='blue--text text--darken-3 ml-2' style='text-decoration: underline;'>Telegram</a></p>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>

        </v-expansion-panel>

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
// import Loading from '@/components/Loading'
const isMobile = (window.innerWidth < 1264) ? true : false;

export default {
  name: 'Guide',
  // components: { Loading },
  mixins: [mixinDataAnal],
  data () {
    return {
      isMobile : '',
      panel : { started: [1], guideBet :[0], guideLogin: [0], shouldKnow : [1,1,1,1],},
      loader :{ gameList : false },
    }
  },
  methods : {

  },
  async created(){
    this.dataAnalysis(20100);
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

<style scoped >
.guidePage{max-width: 850px;}
.linkTxt{text-decoration: underline;color:#666;}
.walletImg{width:300px;height:auto;}
.trustImg{width:auto;height:100px;border-radius:10px;}
.v-expansion-panel__header{background-color:#eee;}

@media screen and (min-width:0px) and (max-width: 960px){
.popupImg{width:100%;height:auto;}
}
</style>

