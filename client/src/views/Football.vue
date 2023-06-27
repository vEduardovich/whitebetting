<template>
  <div class='gamePage' >

    <v-layout wrap class='gameItem'>
      <v-flex xs12 lg8>
        <v-layout row wrap class='mt-4 mr-1'>
          <p class='grey--text text--darken-1' v-bind:class="[{'ml-4': $vuetify.breakpoint.mdAndUp} ]">* {{league.name}}, {{league.country}}</p>
          <!-- Telegram -->
          <v-layout row wrap justify-end>
          <div class='mr-3'>
            <a target="_blank" v-bind:href="sns.telegram" class="" onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;" title='share this match on telegram' ><v-icon class='fab fa-telegram-plane' style='color:#2196F3;' v-on:click='dataAnalysis(1001)'></v-icon></a>
          </div>

          <!-- twitter -->
          <div class='mr-3'>
            <a target="_blank" v-bind:href="sns.twitter" class="" onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;" title='share this match on twitter' v-on:click='dataAnalysis(1002)' ><v-icon class='fa fa-twitter' style='color:#2196F3;'></v-icon></a>
          </div>
          <!-- FaceBook -->
          <a title='share this match on facebook' v-on:click='dataAnalysis(1003)'>
            <social-sharing v-bind:url="sns.facebook.href"
            v-bind:quote="sns.facebook.description"
            hashtags="WhiteBetting"
            twitter-user="@BettingWhite"
            inline-template>
              <network network="facebook">
                <i class='fa fa-facebook-official' style='color:#3F51B5;font-size:25px;'></i>
              </network>
            </social-sharing>
          </a>
          </v-layout>

        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout wrap class='gameItem'>
      <!-- <v-flex lg5></v-flex> -->
      <v-flex xs12 lg3>
        <p class='teal--text text--lighten-2 scoreNotice'  v-if='gameStatusId == 4 ||  gameStatusId == 6'>The score is updated every 1 minute <v-icon size=20 class='grey--text text--darken-1 mr-1' v-on:click='_fetchData(gameInfo.fixture_id);dataAnalysis(4100);'>refresh</v-icon> </p>
      </v-flex>
    </v-layout>

    <v-layout column wrap >
      <v-layout row wrap class='gameItem'>
        <v-flex xs12 lg8 >
          <div class='grey--text mb-1 gameCard open' v-bind:class="[{'ml-4': $vuetify.breakpoint.lgAndUp }, {'mb-2': $vuetify.breakpoint.lgAndUp } ]"   >

          <!-- Score -->
            <div v-if='gameStatusId == 4 || gameStatusId == 5 || gameStatusId == 6'>
              <v-layout row wrap>
                <v-flex >
                  <!-- <div class="text-xs-center pa-1"  v-bind:class="[ {'teal lighten-2 white--text' : gameStatusId == 5}, {'grey darken-3 white--text' : gameStatusId == 6} ]" ><strong>Score</strong></div> -->

                  <div class="text-xs-center pa-1"  v-bind:class="[ {'teal lighten-2 white--text' : gameStatusId == 4}, {'grey darken-3 white--text' : gameStatusId == 5 || gameStatusId == 6} ]" ><strong>{{gameInfo.status}}</strong></div>
                </v-flex>

              </v-layout>
              <v-layout row justify-center >
                <!-- 홈팀 -->
                <v-flex xs4>
                  <v-layout column wrap>
                    <p class='text-xs-center scoreNum mt-4 mb-4' v-bind:class="[ {'teal--text white--text' : gameStatusId == 4}, {'grey--text text--darken-3 ' : gameStatusId == 5 || gameStatusId == 6} ]"><strong>{{gameInfo.goalsHomeTeam}}</strong></p>
                  </v-layout>
                </v-flex>
                <!-- 무승부 -->
                <v-flex xs4 >
                  <v-layout column wrap>
                    <p class='grey--text text--darken-3 text-xs-center scoreNum mt-4 mb-4'>-</p>
                  </v-layout>
                </v-flex>

                <!-- 원정팀 -->
                <v-flex xs4>
                  <v-layout column wrap>
                    <p class='text-xs-center scoreNum mt-4 mb-4' v-bind:class="[ {'teal--text white--text' : gameStatusId == 4}, {'grey--text text--darken-3 ' : gameStatusId == 5 || gameStatusId == 6} ]"><strong>{{gameInfo.goalsAwayTeam}}</strong></p>
                  </v-layout>
                </v-flex>
              </v-layout>
            </div>

          <!-- team selecting  -->
            <v-layout row >
              <v-flex >
                <div v-if='gameStatusId != 4 && gameStatusId != 5 && gameStatusId != 11' class="pink lighten-2 white--text text-xs-center pa-1" ><strong>{{ gameInfo.event_date_local }}, {{gameInfo.event_date_mlocal}}</strong></div>
                <div v-if='gameStatusId == 4 || gameStatusId == 5 || gameStatusId == 6' class="grey lighten-2 grey--text text--darken-2 text-xs-center pa-1" >{{gameInfo.event_date_local}}</div>
              </v-flex>
            </v-layout>
            <v-layout row justify-center >
              <!-- <v-flex xs4 sm9 md6 > -->
              <!-- 홈팀 -->
              <v-flex xs4 >
                <v-btn  class="white ma-0 pa-0 gameBtn"  v-on:click='selectTeam(1, gameInfo.homeTeam, gameInfo.odd && gameInfo.odd.homeTeam)' v-bind:class="[{'light-blue lighten-5': gameResult.fullTime == 1 && gameInfo.open_status != 5}, {'light-blue lighten-5': gameResult.fullTime == 1 && gameInfo.open_status == 5 }]">
                  <v-layout column wrap >
                    <p class='where mt-2'>Home</p>
                    <div class='teamImgBox'>
                      <!-- 이미지가 없을경우 apiFootball에서 가져온다 -->
                      <img v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${gameInfo.homeTeam_id}.png`" @error="apiFootballImg($event, gameInfo.homeTeam_id)" alt='home team flag' class='teamLogo'/>
                    </div>
                    <p class='teamNameTxt mt-3'>{{gameInfo.homeTeam}}</p>
                    <p class='betOdd mt-2 mb-3 '>
                      {{gameInfo.odd && gameInfo.odd.homeTeam}}
                    </p>
                  </v-layout>
                </v-btn>
              </v-flex>

              <!-- 무승부 -->
              <v-flex xs4 >
                <v-btn class="ma-0 pa-0 gameBtn drawBtn"  v-on:click='selectTeam(2, "Draw", gameInfo.odd && gameInfo.odd.drawTeam)' v-bind:class="[{'light-blue lighten-5': gameResult.fullTime == 2 && gameInfo.open_status != 5}, {'light-blue lighten-5': gameResult.fullTime == 2 && gameInfo.open_status == 5 }]">
                  <v-layout column wrap>
                    <p class='where mt-2'>&nbsp;</p>
                    <div class='teamImgBox'>
                      <p class='teamLogo drawBtn' style='line-height:100px;'>Vs</p>
                    </div>
                    <p class='teamNameTxt mt-3'>Draw</p>
                    <p class='betOdd mt-2 mb-3'>
                      {{gameInfo.odd && gameInfo.odd.drawTeam}}
                    </p>
                  </v-layout>
                </v-btn>
              </v-flex>

              <!-- 원정팀 -->
              <v-flex xs4>
                <v-btn class="white ma-0 pa-0 gameBtn " v-on:click='selectTeam(3, gameInfo.awayTeam, gameInfo.odd && gameInfo.odd.awayTeam)' >
                  <v-layout column wrap v-bind:class="[{'light-blue lighten-5': gameResult.fullTime == 3 && gameInfo.open_status != 5}, {'light-blue lighten-5': gameResult.fullTime == 3 && gameInfo.open_status == 5 }]">
                    <p class='where mt-2'>Away</p>
                    <div class='teamImgBox'>
                      <img v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${gameInfo.awayTeam_id}.png`" @error="apiFootballImg($event, gameInfo.awayTeam_id)" alt='away team flag' class='teamLogo'/>
                      <!-- <img v-bind:src="`https://www.api-football.com/public/teams/${gameInfo.awayTeam_id}.png`" alt='away team flag' class='teamLogo'/> -->
                    </div>
                    <p class='teamNameTxt mt-3'>{{gameInfo.awayTeam}}<p>
                    <p class='betOdd mt-2 mb-3' >
                      {{gameInfo.odd && gameInfo.odd.awayTeam}}
                    </p>
                  </v-layout>
                </v-btn>
              </v-flex>

            </v-layout>

          <!-- Double Chance 자리 -->
            <v-layout row justify-center wrap>
              <v-flex xs12 >
                <div class="pink lighten-4 white--text text-xs-center pa-1" ><strong>Double Chance</strong></div>
              </v-flex>
              <!-- Draw&Home -->
              <v-flex xs4 >
                <v-btn  class="white ma-0 pa-0 gameBtn  text-capitalize"  v-on:click='selectTeam(6, `${gameInfo.homeTeam} or Draw`, gameInfo.odd && gameInfo.odd.homeTeamAndDraw)' v-bind:class="[{'light-blue lighten-5': (gameResult.fullTime == 1 || gameResult.fullTime == 2) && gameInfo.open_status != 5}, {'light-blue lighten-5': (gameResult.fullTime == 1 || gameResult.fullTime == 2) && gameInfo.open_status == 5 }]">
                  <v-layout column wrap >
                    <p class=' mt-3 '><strong>{{gameInfo.homeTeam}}<br/><span class='text-lowercase'>or </span>Draw</strong></p>
                    <p class='betOdd mt-2 mb-3' >
                      {{gameInfo.odd && gameInfo.odd.homeTeamAndDraw}}
                    </p>
                  </v-layout>
                </v-btn>
              </v-flex>

              <!-- Home&Away -->
              <v-flex xs4 >
                <v-btn class=" ma-0 pa-0 gameBtn text-capitalize"  v-on:click='selectTeam(7, `${gameInfo.homeTeam} or ${gameInfo.awayTeam}`, gameInfo.odd && gameInfo.odd.homeAndAwayTeam)' v-bind:class="[{'light-blue lighten-5': (gameResult.fullTime == 1 || gameResult.fullTime == 3) && gameInfo.open_status != 5}, {'light-blue lighten-5': (gameResult.fullTime == 1 || gameResult.fullTime == 3) && gameInfo.open_status == 5 }]" >
                  <v-layout column wrap >
                    <p class=' mt-3' ><strong>{{gameInfo.homeTeam}}<br/><span class='text-lowercase'>or </span>{{gameInfo.awayTeam}}</strong></p>
                    <p class='betOdd mt-2 mb-3'>
                      {{gameInfo.odd && gameInfo.odd.homeAndAwayTeam}}
                    </p>
                  </v-layout>
                </v-btn>
              </v-flex>

              <!-- Draw&Away -->
              <v-flex xs4>
                <v-btn class="white ma-0 pa-0 gameBtn  text-capitalize" v-on:click='selectTeam(8, `${gameInfo.awayTeam} or Draw`, gameInfo.odd && gameInfo.odd.awayTeamAndDraw)'  v-bind:class="[{'light-blue lighten-5': (gameResult.fullTime == 3 || gameResult.fullTime == 2) && gameInfo.open_status != 5}, {'light-blue lighten-5': (gameResult.fullTime == 3 || gameResult.fullTime == 2) && gameInfo.open_status == 5 }]" >
                  <v-layout column wrap>
                    <p class='mt-3'><strong>{{gameInfo.awayTeam}}<br/><span class='text-lowercase'>or </span>Draw</strong></p>
                    <p class='betOdd mt-2 mb-3' >
                      {{gameInfo.odd && gameInfo.odd.awayTeamAndDraw}}
                    </p>
                  </v-layout>
                </v-btn>
              </v-flex>

            </v-layout>

          <!-- 언더오버 자리 -->
            <v-layout row justify-center wrap v-if='gameInfo.odd && gameInfo.odd.over' >
              <v-flex xs12 >
                <div class="pink lighten-4 white--text text-xs-center pa-1" ><strong>Goals Over/Under</strong></div>
              </v-flex>
              <v-flex xs5>
                <v-btn class="white ma-0 pa-3 underOverBtn " v-on:click='selectTeam(4, "Over" ,gameInfo.odd && gameInfo.odd.over)' v-bind:class="[{'light-blue lighten-5': gameResult.overUnder == 1 && gameInfo.open_status != 5}, {'light-blue lighten-5': gameResult.overUnder == 1 && gameInfo.open_status == 5 }]" >
                  <v-layout column wrap>
                    <p class="text-xs-center" ><strong>Over</strong></p>
                    <p class='betOdd my-1' >
                      {{gameInfo.odd && gameInfo.odd.over}}
                    </p>
                  </v-layout>
                </v-btn>
              </v-flex>
              <v-flex xs2 class='grey lighten-4'>
                  <v-layout column justify-center >
                    <p class="text-xs-center mt-2 pt-2 grey--text text--darken-3 " >GOALS</p>
                    <p class="text-xs-center grey--text text--darken-3 subheading" >2.5</p>
                  </v-layout>
              </v-flex>
              <v-flex xs5>
                  <v-btn class="white ma-0 pa-3 underOverBtn " v-on:click='selectTeam(5, "Under" ,gameInfo.odd && gameInfo.odd.under)' v-bind:class="[{'light-blue lighten-5': gameResult.overUnder == 2 && gameInfo.open_status != 5}, {'light-blue lighten-5': gameResult.overUnder == 2 && gameInfo.open_status == 5 }]">
                    <v-layout column wrap >
                      <p class="text-xs-center" ><strong>Under</strong></p>
                      <p class='betOdd my-1'>
                        {{gameInfo.odd && gameInfo.odd.under}}
                      </p>
                    </v-layout>
                  </v-btn>
              </v-flex>
            </v-layout>

            <v-layout column >
              <v-flex>
                <!-- 진행중일때는 blue lighten-4, 닫혔을 때는 grey darken-3 -->
                <div class="blue lighten-2 white--text pa-1 text-xs-center" >
                  <v-tooltip bottom :open-delay=0>
                    <template v-slot:activator="{ on }"  >
                      <a v-if='gameStatusId == 5 && gameInfo.reward_tx' v-on="on" class='mr-1 ' v-bind:href="'https://etherscan.io/tx/'+gameInfo.reward_tx" target='_blank'><v-icon class='	fas fa-external-link-alt external_link grey--text text--darken-3'  v-on:click='dataAnalysis(1201)' ></v-icon></a>
                    </template>
                    <span>View on Etherscan</span>
                  </v-tooltip>
                  <strong >{{gameStatus}}</strong>
                </div>
                <!-- <div class="grey darken-3 white--text pa-2 text-xs-center" ><strong>베팅 진행 중..</strong></div> -->
              </v-flex>
            </v-layout>

          </div>

          <v-layout row wrap class='mr-2 mt-1' v-bind:class="[{'mr-0': $vuetify.breakpoint.lgAndUp }, ]">
            <v-flex xs12 >
              <div class="grey lighten-5 text-xs-right" v-if='isWalletLogin' ><span class='myEthTxt'>Account Balance </span> <span class="myEthNum" >{{myETH}}</span><span class='myEthTxt'> ETH </span><span>[ </span><span class='myWhiteNum'>{{white}} W </span><span>]</span><span v-if='contractInfo.name != "mainnet"'>&nbsp;({{contractInfo.name}})</span></div>

              <div class="grey lighten-5 text-xs-right" v-if='isShowWallet.trust' >
                  <a v-bind:href="'https://link.trustwallet.com/open_url?coin_id=60&url=https%3A%2F%2Fwhitebetting.com%2Ffootball%2F'+ gameInfo.fixture_id" class='metamaskTxt' v-on:click='dataAnalysis(1202)'>
                    Open in <img src="https://whitebetting.s3.amazonaws.com/game/inGame/trustWallet.png" alt='Open in Trust Wallet' class='walletImg'/> <span class='trustWalletTxt'>Trust Wallet</span>
                  </a>
              </div>

              <div class="grey lighten-5 text-xs-right" v-if='isShowWallet.metaMask' > <span class='metamaskTxt'>Please log in to </span><img src="https://whitebetting.s3.amazonaws.com/game/inGame/metamask.png" alt='Please log in to MetaMask' class='walletImg'/><span class='metamaskTxt'>MetaMask</span></div>
              <div class="grey lighten-5 text-xs-right" v-if='isShowWallet.getMetamask' > <a href ='https://metamask.io/' target='_blank' v-on:click='dataAnalysis(1203)'>Get Metamask</a></div>
            </v-flex>
          </v-layout>
        </v-flex>

        <!-- PC 베팅 팝업창 -->
        <v-flex lg3 class='pcPopBet mx-2' v-if='pcPopBet'>
          <transition name='fade'>
            <v-card
              class="blue darken-4 hidden-md-down"
              dark
            >
              <!-- 베팅중 나타나는 화면연출 -->
              <div v-html='betMask'></div>
              <!-- 로그인 부터 하세요 -->
              <div class='inPlay' v-if='loginWindow'>
                <h3 class='mt-4 text-xs-center waitingConfirm'>Please log in to MetaMask</h3>
                <v-btn large class='placeBetTxt coinIcon mt-4' color='pink darken-2' v-on:click='loginFirst'>

                  Confirm
                </v-btn>
              </div>
              <!-- 베팅 취소화면 -->
              <div class='inPlay' v-if='cancelWindow'>
                <h3 class='mt-4 text-xs-center waitingConfirm'>Your bet has been canceled</h3>
                <v-btn large class='placeBetTxt coinIcon mt-4' color='pink darken-2' v-on:click='cancelWindow = false; dataAnalysis(1502);'>
                  Play again
                </v-btn>
              </div>
              <!-- 계약 최종 성공화면 -->
              <div class='inPlay' v-if='finalBetInfo.bool'>
                <div class='closeBetBtn'>
                  <v-btn fab small class='blue darken-4' v-on:click='finalBetInfo.bool = false; dataAnalysis(1503);' >
                    <v-icon >close</v-icon>
                  </v-btn>
                </div>
                <h3 class='text-xs-center waitingConfirm' style='margin-top:30px;'>This contract
                  <a v-bind:href="'https://etherscan.io/address/'+ contract.to" target='_blank'  v-on:click='dataAnalysis(1504)'>
                    <v-icon size='24px' class='iCodeLink' color='yellow'>transit_enterexit</v-icon>
                  </a>
                  was concluded.
                </h3>
                <!-- <v-icon size='80px' class='mt-4 text-xs-center' color='rgba(255,255,0,0.5)' style='z-index:-5;position:absolute;;'>thumb_up</v-icon> -->
                <img src="https://whitebetting.s3.amazonaws.com/game/inGame/guarantee.png" alt='This contract is guaranteed' class='guaranteeImg' />

                <h3 class='mt-3 text-xs-center waitingConfirm yellow--text' style='font-size:20px;'>
                  <span >{{ finalBetInfo.teamName }}</span>
                  <span class='white--text font-weight-normal' v-if='finalBetInfo.selectedTeam == 1 || finalBetInfo.selectedTeam == 3'>&nbsp;Win</span>
                </h3>
                <h4 class='mt-2 text-xs-center' style='font-size:18px;'>
                  <span class='yellow--text' >{{ betEth }}</span>
                  <span style='font-size:15px;' >&nbsp;ETH</span>
                  <span style='font-size:15px;'>&nbsp;&nbsp;x&nbsp;</span>
                  <span class='yellow--text' >{{ finalBetInfo.teamOdd }}</span>
                </h4>

                <h4 class='text-xs-center' style='font-size:20px;'>
                  <span style='font-size:15px;' >&nbsp;=&nbsp;</span>
                  <span class='yellow--text' >{{ finalBetInfo.betResult }}</span>
                  <span style='font-size:15px;' >&nbsp;ETH</span>
                </h4>

                <h4 class='mt-2 text-xs-center' style='font-size:12px;'>
                  <span>Payouts will be made within 30 minutes after the match finish.</span>
                </h4>
              </div>

              <!-- 보상금액 초과로 베팅이 불가능한 게임 -->
              <div class='inPlay' v-if='unableBetWindow'>
                <h3 class='mt-4 text-xs-center waitingConfirm'>I'm sorry, but you've bet more than we can pay.</h3>
                <h4 class='mt-4 text-xs-center waitingConfirm'>Please try to lower your stake or choose another match of low odds!</h4>
                <v-btn large class='placeBetTxt coinIcon mt-4' color='pink darken-2' v-on:click='unableBetWindow = false;dataAnalysis(1510);'>
                  Play again
                </v-btn>
              </div>

              <!-- Odd가 변경되어 베팅 불가능한 게임 -->
              <div class='inPlay' v-if='incorrectOddWindow'>
                <h3 class='mt-4 text-xs-center waitingConfirm'>Odds have changed.<br/> Please page reload.</h3>
                <v-btn large class='placeBetTxt coinIcon mt-4' color='pink darken-2' v-on:click='pageReload();dataAnalysis(1511);'>
                  Page reload
                </v-btn>
              </div>
              <!-- 베팅중 나타나는 화면연출 끝 -->

              <div class='closeBetBtn'>
                <v-btn fab small class='blue darken-4 closePopupBtn'  v-on:click='pcPopBet = false;dataAnalysis(1527);' >
                  <v-icon >close</v-icon>
                </v-btn>
              </div>

              <!-- 베팅창 베팅 정보! -->
              <v-card-text class="title font-weight-bold yellow--text text-xs-left" >
                <span>{{ betInfo.teamName }}</span>
                <span class='white--text font-weight-normal' v-if='betInfo.selectedTeam == 1 || betInfo.selectedTeam == 3'> Win</span>
              </v-card-text>
              <h4 class='mx-3 mb-2 kindOfGame text-xs-left' v-if='betInfo.selectedTeam == 1 || betInfo.selectedTeam == 2 || betInfo.selectedTeam == 3'> Full Time Result</h4>
              <h4 class='mx-3 mb-2 kindOfGame text-xs-left' v-if='betInfo.selectedTeam == 4 || betInfo.selectedTeam == 5'> Goals Over/Under</h4>
              <h4 class='mx-3 mb-2 kindOfGame text-xs-left' v-if='betInfo.selectedTeam == 6 || betInfo.selectedTeam == 7 || betInfo.selectedTeam == 8'> Double Chance</h4>
              <v-layout row wrap>
                <h3 class='mx-3 yellow--text'>
                  <v-icon class='fab fa-ethereum'></v-icon>
                  <span> x {{ betInfo.teamOdd }}</span>
                </h3>
                <h4 class='toReturnTxt'>To Return</h4>
                <h2 class='toReturnNum' >{{ betResult }}</h2>
                <h4 class='toReturnUnitTxt'>ETH</h4>
              </v-layout>
              <!-- PC 팝업 -->
              <v-layout row wrap  class='pt-2 ml-2'>
                <a class='quickBetBtn mr-3' v-on:click='ethSetFuc(1);'><button>Min</button></a>
                <a class='quickBetBtn' v-on:click='ethSetFuc(2);'><button>+0.05</button></a>
                <a class='quickBetBtn' v-on:click='ethSetFuc(3)'><button>+0.50</button></a>
                <a class='quickBetBtn ml-3' v-on:click='ethSetFuc(4);'><button>Max</button></a>
              </v-layout>

              <v-card-actions>
                <v-layout column wrap>
                  <v-layout row wrap>
                    <v-flex xs3>
                      <v-hover>
                        <a v-on:click='minusFunc' slot-scope="{ hover }">
                          <button>
                            <v-icon class='quickBetAddBtn' v-bind:class="`${hover ? 'pink--text' : 'white--text'}`" v-on:mousedown="intervalStart(1)" v-on:mouseup="intervalStop(1)" v-on:touchstart="intervalStart(1)" v-on:touchend="intervalStop(1)" v-on:touchcancel="intervalStop(1)">remove</v-icon>
                          </button>
                        </a>
                      </v-hover>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        class='betEthTxt mb-2 mx-1 '
                        v-model='betEth'
                        type='number'
                        label="ETH"
                        v-on:click:clear ="clearEth"
                        v-on:keyup='checkEth'
                        v-on:keyup.enter.native='placeBet(gameInfo._id, gameInfo.fixture_id, betInfo.selectedTeam, betInfo.teamName, betEth, betInfo.teamOdd)'
                        v-on:blur='onBlurEthTxt'
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs3>
                      <v-hover>
                        <a v-on:click='plusFunc' slot-scope="{ hover }">
                          <button>
                            <v-icon class='quickBetAddBtn' v-bind:class="`${hover ? 'yellow--text' : 'white--text'}`" v-on:mousedown="intervalStart(2)" v-on:mouseup="intervalStop(2)" v-on:touchstart="intervalStart(2)" v-on:touchend="intervalStop(2)" v-on:touchcancel="intervalStop(2)">add</v-icon>
                          </button>
                        </a>
                      </v-hover>
                    </v-flex>
                  </v-layout>

                <v-btn large class='placeBetTxt my-2' color='pink darken-2'
                  v-on:click='placeBet(gameInfo._id, gameInfo.fixture_id, betInfo.selectedTeam, betInfo.teamName, betEth, betInfo.teamOdd)'
                  v-bind:loading="loader.placeBet"
                >
                  Place Bet All Test!
                </v-btn>                
                <p v-show=true class='extraInfo text-xs-left'>*1st half, 2nd half (excluding Extra time, P.K.)</p>

                </v-layout>
              </v-card-actions>
            </v-card>
          </transition>
        </v-flex>

        <!-- 경기 예측 -->
        <v-flex xs12 lg8 >
          <!-- 채팅창을 PC오른쪽에 넣기위해 아래처럼 한번 더 감싼다 -->
          <v-flex xs12>
            <!-- 경기가 끝나면 게임정보를 안보여줬지만 포폴용으로 다시 살림. 21.12.07 -->
            <!-- <v-layout column wrap class='my-4 mb-2' v-bind:class="[{'mt-4 ml-4': $vuetify.breakpoint.mdAndUp} ]" v-if="homeStatInfo && gameInfo.open_status == 3" > -->
            <v-layout column wrap class='my-4 mb-2' v-bind:class="[{'mt-4 ml-4': $vuetify.breakpoint.mdAndUp} ]" >
            <!-- <v-layout column wrap class='my-4 mb-2' v-bind:class="[{'mt-4 ml-4': $vuetify.breakpoint.mdAndUp} ]" v-if="gameInfo.open_status == 3" > -->
              <v-layout align-end wrap class='ml-2'>
                <v-icon style='line-height:20px;font-size:18px;' class='fas fa-certificate' ></v-icon>
                <h3 class="betHistoryTxt ml-1"  >
                  Match Statistics
                </h3>
              </v-layout>
              <carousel :scrollPerPage="true" :perPageCustom="[[10, 1], [1800, 1]]" :paginationSize=10 :paginationPadding=10 >
                <!-- stat이 없을때는 가디언과 유튜브영상만 보이도록 한다 -->
                <slide v-if="homeStatInfo">
                  <v-layout column wrap style='max-width:98%;'>
                    <v-flex xs12 v-if='league.name' >
                      <div style='' class='stat_grey pa-1 mt-2 text-xs-center ' >
                        <p>{{gameInfo.venue}}</p>
                      </div>
                    </v-flex>
                    <!-- 팀이름 row -->
                    <v-layout row wrap class='stat_TeamName mt-1' v-bind:class="[{'mt-2 ': $vuetify.breakpoint.mdAndUp} ]">
                      <v-flex xs4 class='' >
                        <h3 class='text-xs-right stat_grey ' >{{gameInfo.homeTeam}}</h3>
                      </v-flex>
                      <v-flex xs4 class='stat_vs '>
                        <p>CLUB</p>
                      </v-flex>
                      <v-flex xs4 class='' >
                        <h3 class='text-xs-left stat_grey'>{{gameInfo.awayTeam}}</h3>
                      </v-flex>
                    </v-layout>

                    <!-- Rank row -->
                    <v-layout row wrap class='stat_rank ' v-if='homeStatInfo.rank'>
                      <v-flex xs4  class=' text-xs-right  '>
                        <p v-if='homeStatInfo.rank'>{{homeStatInfo.rank}}th</p>
                        <p v-else>-</p>
                      </v-flex>

                      <v-flex xs4 class=''>
                        <p class='stat_vs '>RANK</p>
                      </v-flex>

                      <v-flex xs4  class=' text-xs-left  ' v-if='awayStatInfo.rank'>
                        <p v-if='awayStatInfo.rank'>{{awayStatInfo.rank}}th</p>
                        <p v-else>-</p>
                      </v-flex>
                    </v-layout>

                    <!-- Record row -->
                    <v-layout row wrap class='stat_rank ' v-if='homeStatInfo.all' >
                      <v-flex xs4  class='text-xs-right'>
                        <p >{{homeStatInfo.all.win}}W  / {{homeStatInfo.all.draw}}D / {{homeStatInfo.all.lose}}L</p>
                      </v-flex>

                      <v-flex xs4 class=''>
                        <p class='stat_vs ' style='line-height:30px;'>RECORD</p>
                      </v-flex>

                      <v-flex xs4  class='text-xs-left  ' v-if='awayStatInfo.all'>
                        <p>{{awayStatInfo.all.win}}W / {{awayStatInfo.all.draw}}D / {{awayStatInfo.all.lose}}L</p>
                      </v-flex>
                    </v-layout>

                    <!-- win/lose -->
                    <v-layout row wrap class='stat_rank mt-1'>
                      <v-flex xs4  class='text-xs-right ' v-if='homeStatInfo.formeArr' >
                        <span v-if="homeStatInfo.formeArr[4]" class='last5Icon ' v-bind:class="[{'winIcon': homeStatInfo.formeArr[4] == 'W'},{'drawIcon': homeStatInfo.formeArr[4] == 'D'},{'loseIcon': homeStatInfo.formeArr[4] == 'L'} ]">{{homeStatInfo.formeArr[4]}}</span>
                        <span v-if="homeStatInfo.formeArr[3]" class='last5Icon ' v-bind:class="[{'winIcon': homeStatInfo.formeArr[3] == 'W'},{'drawIcon': homeStatInfo.formeArr[3] == 'D'},{'loseIcon': homeStatInfo.formeArr[3] == 'L'} ]">{{homeStatInfo.formeArr[3]}}</span>
                        <span v-if="homeStatInfo.formeArr[2]" class='last5Icon ' v-bind:class="[{'winIcon': homeStatInfo.formeArr[2] == 'W'},{'drawIcon': homeStatInfo.formeArr[2] == 'D'},{'loseIcon': homeStatInfo.formeArr[2] == 'L'} ]">{{homeStatInfo.formeArr[2]}}</span>
                        <span v-if="homeStatInfo.formeArr[1]" class='last5Icon ' v-bind:class="[{'winIcon': homeStatInfo.formeArr[1] == 'W'},{'drawIcon': homeStatInfo.formeArr[1] == 'D'},{'loseIcon': homeStatInfo.formeArr[1] == 'L'} ]">{{homeStatInfo.formeArr[1]}}</span>
                        <v-tooltip bottom :open-delay=0>
                          <template v-slot:activator="{ on }" >
                          <span v-if="homeStatInfo.formeArr[0]" v-on="on" class='last5Icon loseIcon lastIcon' v-bind:class="[{'winIcon': homeStatInfo.formeArr[0] == 'W'},{'drawIcon': homeStatInfo.formeArr[0] == 'D'},{'loseIcon': homeStatInfo.formeArr[0] == 'L'} ]">{{homeStatInfo.formeArr[0]}}</span>
                          </template>
                          <span>Most recent match</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs4 class='text-xs-right' v-else ><span>-</span></v-flex>

                      <v-flex xs4 class=''>
                        <p class='stat_vs ' style='line-height:25px;'>FORM</p>
                      </v-flex>

                      <v-flex xs4 class=' text-xs-left ' v-if='awayStatInfo.formeArr' >
                        <v-tooltip bottom :open-delay=0 >
                          <template v-slot:activator="{ on }" >
                            <span v-if="awayStatInfo.formeArr[0]" v-on="on" class='last5Icon loseIcon lastIcon lastAwayIcon' v-bind:class="[{'winIcon': awayStatInfo.formeArr[0] == 'W'},{'drawIcon': awayStatInfo.formeArr[0] == 'D'},{'loseIcon': awayStatInfo.formeArr[0] == 'L'} ]">{{awayStatInfo.formeArr[0]}}</span>
                          </template>
                          <span>Most recent match</span>
                        </v-tooltip>
                        <span v-if="awayStatInfo.formeArr[1]" class='last5Icon ' v-bind:class="[{'winIcon': awayStatInfo.formeArr[1] == 'W'},{'drawIcon': awayStatInfo.formeArr[1] == 'D'},{'loseIcon': awayStatInfo.formeArr[1] == 'L'} ]">{{awayStatInfo.formeArr[1]}}</span>
                        <span v-if="awayStatInfo.formeArr[2]" class='last5Icon ' v-bind:class="[{'winIcon': awayStatInfo.formeArr[2] == 'W'},{'drawIcon': awayStatInfo.formeArr[2] == 'D'},{'loseIcon': awayStatInfo.formeArr[2] == 'L'} ]">{{awayStatInfo.formeArr[2]}}</span>
                        <span v-if="awayStatInfo.formeArr[3]" class='last5Icon ' v-bind:class="[{'winIcon': awayStatInfo.formeArr[3] == 'W'},{'drawIcon': awayStatInfo.formeArr[3] == 'D'},{'loseIcon': awayStatInfo.formeArr[3] == 'L'} ]">{{awayStatInfo.formeArr[3]}}</span>
                        <span v-if="awayStatInfo.formeArr[4]" class='last5Icon ' v-bind:class="[{'winIcon': awayStatInfo.formeArr[4] == 'W'},{'drawIcon': awayStatInfo.formeArr[4] == 'D'},{'loseIcon': awayStatInfo.formeArr[4] == 'L'} ]">{{awayStatInfo.formeArr[4]}}</span>
                      </v-flex>
                      <v-flex xs4 class='text-xs-left' v-else ><span>-</span></v-flex>
                    </v-layout>

                    <!-- Goals per match row -->
                    <v-layout row wrap class='stat_rank mt-2' v-if="homeStatInfo.goals_avg" >
                      <v-flex xs4  class=' text-xs-center text-xs-right'>
                        <p style='line-height:35px;'>+{{homeStatInfo.goals_avg}} / -{{homeStatInfo.goals_against_avg}}</p>
                      </v-flex>

                      <v-flex xs4 class=''>
                        <p class='stat_vs '>+AVG. GOALS</p>
                        <p class='stat_vs ' style='line-height:8px;'>/ -AGAINST</p>
                      </v-flex>

                      <v-flex xs4  class=' text-xs-left ' v-if="awayStatInfo.goals_avg">
                        <p style='line-height:35px;'>+{{awayStatInfo.goals_avg}} / -{{awayStatInfo.goals_against_avg}}</p>
                      </v-flex>
                    </v-layout>

                  </v-layout>


                  <!-- Last 3 -->
                  <v-layout column wrap class='mt-4'>
                    <!-- <v-flex xs12 v-if='homeStatInfo.h2h.length>0' > -->
                    <v-flex xs12 >
                      <div style='' class='stat_grey pa-1 text-xs-center ' >
                        <h3>LAST H2H</h3>
                      </div>
                    </v-flex>
                    <!-- Last h2h -->
                    <v-layout v-if='homeStatInfo.h2h == null || homeStatInfo.h2h == 0'>
                      <v-flex xs12 class='text-xs-center mt-4 grey--text'><span>No data available</span></v-flex>
                    </v-layout>
                    <v-layout v-else row wrap class='stat_rank mt-2' v-for="(h2h, idx) in homeStatInfo.h2h" v-bind:key="idx" >
                      <v-flex xs4 wrap class='text-xs-right '>
                        <div>
                          <img v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${h2h.homeTeam_id}.png`" @error="apiFootballImg($event, h2h.homeTeam_id)" alt='home team flag' title='home team flag' class='teamLogoH2h mr-3' />
                        </div>
                        <p style='margin-top:-30px;'>{{h2h.goalsHomeTeam}}</p>
                      </v-flex>
                      <v-flex xs4 class=''>
                        <p class='stat_vs ' style='line-height:10px;'>{{h2h.moment_time}}</p>
                        <p class='stat_vs ' style='line-height:15px;'>{{h2h.leagueShortName}}</p>
                      </v-flex>
                      <v-flex xs4 wrap class=' text-xs-left  '>
                        <p  style='margin-top:-5px;' >{{h2h.goalsAwayTeam}}</p>
                        <div style='margin-top:-22px;' >
                          <img v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${h2h.awayTeam_id}.png`" @error="apiFootballImg($event, h2h.awayTeam_id)" alt='away team flag' title='away team flag' class='teamLogoH2h ml-3'/>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-layout>
                </slide>
                <!-- Match Preview -->

                <slide>
                  <v-layout column wrap class='mt-2'  >
                    <v-flex xs12 v-if=media.guardian >
                      <h3 class='stat_grey text-xs-center '>Match Preview</h3>
                    </v-flex>
                    <!-- Match Preview -->
                    <v-layout row wrap class='stat_rank mt-2' v-for="(el, idx) in media.guardian" v-bind:key="idx" >
                      <v-flex xs12 wrap class='text-xs-right ml-1 ' style='color:grey;margin-top:-5px;' v-bind:class="[{'text-xs-center': $vuetify.breakpoint.mdAndUp} ]">
                        <v-layout row wrap>
                          <v-flex xs3 lg2 class=' pr-2'>
                            <span class='stat_vs' style=''>{{el.moment}}</span>
                          </v-flex>
                          <v-flex xs9 lg10 class='text-xs-left' v-bind:class="[{'pl-4': $vuetify.breakpoint.mdAndUp} ]">
                            <p class='mediaTxt '>
                              <a v-bind:href=el.webUrl target='_blank' v-bind:title=el.webUrl class='grey--text text--darken-3' style='text-decoration: underline;'  v-on:click='dataAnalysis(1301)'>{{el.webTitle}}</a>
                            </p>
                          </v-flex>
                        </v-layout>

                      </v-flex>
                    </v-layout>
                  </v-layout>

                  <!-- Youtube -->
                  <v-layout column wrap class='mt-3'>
                    <v-flex xs12 v-if='media.youtube.length > 0' >
                      <h3 class='stat_grey text-xs-center '>Videos</h3>
                    </v-flex>
                    <!-- Youtube Preview -->
                    <v-layout row wrap class=' mt-2' v-for="(el, idx) in media.youtube" v-bind:key="idx" >
                      <v-flex xs12 class='text-xs-right ml-1 mb-1' style='color:grey;margin-top:-5px;' v-bind:class="[{'text-xs-center': $vuetify.breakpoint.mdAndUp} ]">
                        <v-layout row wrap v-if='el.id' >
                          <v-flex xs3 lg2 class='pr-2'>
                            <span class='stat_vs' style=''>{{el.moment}}</span>
                          </v-flex>
                          <v-flex xs5 lg8 class='text-xs-left' v-bind:class="[{'pl-4': $vuetify.breakpoint.mdAndUp} ]">
                            <p>
                              <a v-if='isCC' v-on:click='popUpYoutubeWindow(idx)' target='_blank' v-bind:title='el.shortTitle' class=' grey--text text--darken-3'>{{el.shortTitle}}</a>
                              <a v-if='!isCC' v-on:click='popUpYoutubeWindow(idx)' v-bind:title='el.title' class=' grey--text text--darken-3' style=''>{{el.title}}</a>
                            </p>
                          </v-flex>
                          <v-flex xs3 lg2>
                            <div class='stat_youtube' >
                              <a v-on:click='popUpYoutubeWindow(idx)' v-bind:title='el.title' class=' grey--text text--darken-3' style=''>
                                <img v-bind:src="`${el.thumbnails}`" alt='thumbnail' title='thumbnail' class=''  style='margin-top:-10px;'/>
                              </a>
                            </div>
                          </v-flex>

                        </v-layout>
                      </v-flex>
                    </v-layout>

                  </v-layout>
                </slide>
              </carousel>
            </v-layout>
          </v-flex>

          <!-- 개인 베팅 통계 -->
          <v-flex xs12 lg12>
            <div class='mt-0 mb-2' style='max-width:98%;' v-bind:class="[{'mt-0 ml-4': $vuetify.breakpoint.mdAndUp} ]" >
              <v-layout align-end wrap class='ml-2'>
                <v-icon style='line-height:20px;font-size:18px;' class='fas fa-certificate' ></v-icon>
                <h3 class="betHistoryTxt ml-1" >
                  Betting statistics
                </h3>
              </v-layout>

              <v-data-table
                class='gameBetInfo'
                v-bind:class="[{'mx-1': $vuetify.breakpoint.mdAndDown}]"
                v-bind:headers="betHeaders"
                v-bind:items="betInfoGames"
                v-bind:loading="loader.gameBetInfo"
                v-bind:pagination.sync="pagination.stats"
                item-key="bet"
              >
                <template slot="items" slot-scope="props" >
                  <tr >
                    <td >{{ props.item.bet }}</td>
                    <td class="text-xs-center">{{ props.item.count }}</td>
                    <td class="text-xs-center">{{ props.item.stake }} Eth</td>
                  </tr>
                </template>

              </v-data-table>
            </div>
            <!-- 개인 베팅 통계 끝-->

            <!-- 베팅 history -->
            <div class='mt-3 mb-2' style='max-width:100%;' v-bind:class="{'mt-4 ml-4': $vuetify.breakpoint.mdAndUp}">
              <v-layout align-end justify-space-between  >
                <v-flex xs5 class='text-xs-left'>
                  <v-layout wrap class='ml-2'>
                    <v-icon style='line-height:15px;font-size:18px;' class='fas fa-book-open' ></v-icon>
                    <h3 class="betHistoryTxt ml-1">
                      Betting History
                    </h3>
                  </v-layout>
                </v-flex>
                <v-flex xs7 class='text-xs-right' >
                  <v-btn  color="pink lighten-3" style='top:10px; ' dark v-on:click="showBetHistory(true)" >
                    All
                  </v-btn>
                  <v-btn color="blue lighten-2" style='top:10px;' dark v-on:click="showBetHistory(false)" >
                    My bets
                  </v-btn>
                </v-flex>
              </v-layout>

              <!-- item을 선택하면 item-key가 같은 것들이 함께 expand되어 골치아프다. 그래서 중복될 수 없는 transaction을 key로 잡는다. 이제 클릭할때 해당 item만 열린다.-->
              <v-data-table
                style='cursor:pointer;'
                v-bind:class="{'mx-1': $vuetify.breakpoint.mdAndDown}"
                v-bind:headers="computedHeaders"
                v-bind:expand="expand"
                v-bind:items="betHistory"
                v-bind:pagination.sync="pagination.history"
                item-key="number"
                disable-initial-sort
              >
                <template slot="items" slot-scope="props" >
                  <tr v-on:click="props.expanded = !props.expanded" class='newAppendedBet' >
                    <td class='betHistoryNum'>{{ props.item.number }}</td>
                    <td class='betHistoryUser' >{{ props.item.user }}</td>
                    <td class="betHistoryBet" >{{ props.item.teamName }}</td>
                    <td >{{ props.item.stake }}</td>
                    <td >{{ props.item.odd }}</td>
                    <td class=" betHistoryGame" v-if="!$vuetify.breakpoint.xs">{{ props.item.market }}</td>
                    <!-- <td class="betHistoryReturns" >{{ props.item.returnEth || 'Not yet' }}</td>                   -->
                    <td class="betHistoryReturns" >
                      <a v-if='props.item.returnEth >0 && props.item.reward_tx' v-bind:href="'https://etherscan.io/tx/'+ props.item.reward_tx" target='_blank' class='betExpandTransaction' v-on:click='dataAnalysis(1312)'>                      
                        <strong >{{ calReturnETh(props.item.returnEth) }}</strong>
                      </a>
                      <p v-else>{{ calReturnETh(props.item.returnEth) }}</p>
                    </td>
                  </tr>
                </template>

                <template slot="expand" slot-scope="props">
                  <!-- 테이블로 만들었더니 모바일 레이아웃을 도저히 설정할 수 없어 아래와 같이 만든다 -->
                  <v-layout row v-if='props.item.transaction' class='expandedList'>
                    <v-flex xs2>
                      <div class='betExpandDesc betExpandFirst ' >Txhash</div>
                    </v-flex>
                    <v-flex xs10>
                      <div class='betExpandValue betExpandFirst' >
                        <a v-bind:href="'https://etherscan.io/tx/'+ props.item.transaction" target='_blank' class='betExpandTransaction' v-on:click='dataAnalysis(1311)'>
                          {{props.item.transaction}}
                        </a>
                      </div>
                    </v-flex>
                  </v-layout>

                  <v-layout row v-if='props.item.createdAt_moment' class='expandedList'>
                    <v-flex xs2 >
                      <div class='betExpandDesc '>Created</div>
                    </v-flex>
                    <v-flex xs10>
                      <div class='betExpandValue ' >{{props.item.createdAt_moment}}</div>
                    </v-flex>
                  </v-layout>

                  <v-layout row v-if='props.item.user' class='expandedList'>
                    <v-flex xs2 >
                      <div class='betExpandDesc'>Player</div>
                    </v-flex>
                    <v-flex xs10>
                      <div class='betExpandValue'>
                        <!-- <a v-bind:href="'https://etherscan.io/address/'+ props.item.user" target='_blank'>
                          {{props.item.user}}
                        </a> -->
                        <router-link v-bind:to='{path:`/user/${props.item.user}`}' v-on:click.native='dataAnalysis(1310)'>
                          {{props.item.user}}
                        </router-link>
                      </div>
                    </v-flex>
                  </v-layout>

                  <v-layout row  v-if='props.item.teamName' class='expandedList'>
                    <v-flex xs2>
                      <div class='betExpandDesc'>Bet</div>
                    </v-flex>
                    <v-flex xs10>
                      <div class='betExpandValue' >{{props.item.teamName}}</div>
                    </v-flex>
                  </v-layout>
                  <v-layout row  v-if='props.item.underOver' class='expandedList'>
                    <v-flex xs2>
                      <div class='betExpandDesc'>Bet</div>
                    </v-flex>
                    <v-flex xs10>
                      <div class='betExpandValue' >{{props.item.underOver}}</div>
                    </v-flex>
                  </v-layout>
                  <v-layout row  v-if='props.item.stake' class='expandedList'>
                    <v-flex xs2>
                      <div class='betExpandDesc'>Stake</div>
                    </v-flex>
                    <v-flex xs10>
                      <div class='betExpandValue' >{{props.item.stake}}</div>
                    </v-flex>
                  </v-layout>
                  <v-layout row  v-if='props.item.odd' class='expandedList'>
                    <v-flex xs2>
                      <div class='betExpandDesc'>Odd</div>
                    </v-flex>
                    <v-flex xs10>
                      <div class='betExpandValue' >{{props.item.odd}}</div>
                    </v-flex>
                  </v-layout>
                  <v-layout row  v-if='props.item.market' class='expandedList'>
                    <v-flex xs2>
                      <div class='betExpandDesc'>Game</div>
                    </v-flex>
                    <v-flex xs10>
                      <div class='betExpandValue' >{{props.item.market}}</div>
                    </v-flex>
                  </v-layout>

                  <v-layout row  class='expandedList'>
                    <v-flex xs2>
                      <div class='betExpandDesc'>Return</div>
                    </v-flex>
                    <v-flex xs10  class='betExpandValue'>
                      <p v-if='props.item.returnEth>0' >
                        <strong>{{ calReturnETh(props.item.returnEth) }}</strong>   
                      </p>
                      <p v-else>{{ calReturnETh(props.item.returnEth) }}</p>
                    </v-flex>
                  </v-layout>

                  <v-layout row v-if='props.item.reward_tx' class='expandedList'>
                    <v-flex xs2>
                      <div class='betExpandDesc betExpandLast' >Return Tx</div>
                    </v-flex>
                    <v-flex xs10>
                      <div class='betExpandValue betExpandLast' >
                        <a v-bind:href="'https://etherscan.io/tx/'+ props.item.reward_tx" target='_blank' class='betExpandTransaction' v-on:click='dataAnalysis(1312)'>
                          {{props.item.reward_tx}}
                        </a>
                      </div>
                    </v-flex>
                  </v-layout>

                </template>
              </v-data-table>
            </div>
          </v-flex>
        </v-flex>
        <!-- 베팅 history 끝 -->


        <!-- 코멘츠 -->
        <v-flex xs12 lg4 class='mt-2' style='margin-top:-14px;' v-bind:class="[{'pl-2 pr-5': $vuetify.breakpoint.lgAndUp } ]" >
          <v-flex xs12 class='mt-1 mb-2 text-xs-left'>
            <v-layout row wrap justify-space-between>
              <h3 class="betHistoryTxt ml-1 " style='line-height:30px;' >
                <v-icon style='line-height:15px;font-size:22px;' class='grey--text text--darken-1 mr-1'>chat</v-icon>
                Comments
                <v-icon size=20 class='grey--text text--darken-1' v-on:click='_getComments(gameInfo.fixture_id,2);dataAnalysis(1321);'>refresh</v-icon>
              </h3>
              <v-btn dark color="blue darken-4" v-on:click="postComment(1)" class='commentPostBtn mr-0' v-bind:class="{'mr-3': $vuetify.breakpoint.xs}" title=' It doesn&#39;t need to sign in'>POST</v-btn>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-textarea
              color="blue"
              v-model='textareaTxt'
              v-bind:row-height=30
              v-bind:rows=1
              v-bind:loading="loader.commentTextarea"
              name="commentTxt"
              class='commentTxt'
              label="What do you think?"
            ></v-textarea>

            <!-- <p v-if='isExcessTxtLen'>excess</p> -->
          </v-flex>

          <v-flex xs12 class='mt-3 mx-2'  >
            <h3 v-if='comments.length>0' class='text-xs-left grey--text text--darken-3'>Newest ({{commentsCount}})</h3>
            <v-layout column wrap>
              <div v-for="(comment, idx) in comments" v-bind:key='idx' class="py-1 grey--text text--darken-2 newAppendedComment pl-1" v-bind:class="[{'pl-4': $vuetify.breakpoint.lgAndUp } ]">
                <div class="text-xs-left pt-2">
                  <v-layout row wrap >
                    <router-link v-if='comment.user'  class='grey--text text--darken-1'  v-bind:to='{path:`/user/${comment.user}`}' title='Go to the player page' v-on:click.native='dataAnalysis(1323)'>                    
                      <div class='commentAvatar'>
                        <img v-bind:src="comment.avatar" class='commentAvatarSize'>
                      </div>
                    </router-link>  
                    <div v-else class='commentAvatar'>
                      <img v-bind:src="comment.avatar" class='commentAvatarSize'>
                    </div> 

                    <router-link v-if='comment.user'  class='grey--text text--darken-1'  v-bind:to='{path:`/user/${comment.user}`}' title='Go to the player page' v-on:click.native='dataAnalysis(1323)'>                                        
                      <h4 class='mb-1 commentNickname' >{{comment.nickname}}</h4>
                    </router-link>
                    <h4 v-else class='mb-1 commentNickname'>{{comment.nickname}}</h4>

                    <span class='ml-2 grey--text text--darken-1' style='font-size:0.9em;line-height:40px;'>{{comment.moment}}</span>
                  </v-layout>
                  <p v-html="comment.article" class='mt-1' v-bind:class="[{'grey--text text--lighten-2':comment.isDeleted }]"></p>
                  <v-layout row wrap justify-space-between >
                    <div class="text-xs-left">
                      <v-btn small fab class='commentBtn'  v-on:click='commentVote(1, idx) ' v-bind:disabled='idx == 0 || comment.isDeleted' v-bind:loading="comment.score.upLoader"><v-icon>keyboard_arrow_up</v-icon></v-btn>
                      <span v-bind:class="[{'blue--text':comment.score.good.length>0 }]">{{comment.score.good.length}}</span>
                      <v-btn small fab class='commentBtn' v-on:click='commentVote(2, idx)' v-bind:disabled='idx == 0 || comment.isDeleted' v-bind:loading="comment.score.downLoader"><v-icon>keyboard_arrow_down</v-icon></v-btn>
                      <span>{{comment.score.bad.length}}</span>
                    </div>
                    <div class='text-xs-right '>
                      <v-btn v-if='userAccount && userAccount == comment.user && !comment.isDeleted' fab small class=' commentBtn'  v-on:click='deleteComment(idx)' >
                        <v-icon >delete</v-icon>
                      </v-btn>
                      <v-btn fab small class=' commentBtn'  v-on:click='replyComment(idx)' v-bind:disabled='idx == 0' v-if='!comment.isDeleted' >
                        <v-icon >chat_bubble </v-icon>
                      </v-btn>
                    </div>

                  </v-layout>

                <!-- 답글 -->
                  <v-layout row wrap v-if='comment.isWritingReply' class='mt-2' >
                    <v-flex xs10>
                      <v-textarea
                        color="blue"
                        v-model='comment.replyText'
                        v-bind:row-height=30
                        v-bind:rows=1
                        v-bind:loading="loader.replyTextarea"
                        name="commentTxt"
                        class='commentTxt'
                        v-bind:label="`Reply to ${comment.nickname}`"
                      ></v-textarea>

                      <!-- <p v-if='isExcessTxtLen'>excess</p> -->
                    </v-flex>
                    <v-flex xs1>
                      <v-btn fab small dark color="blue darken-4" v-on:click="postReply(idx, comment._id, comment.nickname, $event);"  class='commentPostBtn mr-0' v-bind:class="{'mr-3': $vuetify.breakpoint.xs}" title=' It doesn&#39;t need to sign in'><v-icon>edit</v-icon></v-btn>
                    </v-flex>
                  </v-layout>

                </div>

                <!-- 코멘트의 답글 리스트 -->
                <div v-for="(reply, reIdx ) in comment.sub_comment_arr" v-bind:key='reIdx' class="grey--text text--darken-2 replyArea newAppendedReply">
                  <div id="newReply" v-if='reply.new'></div>
                  <div class="text-xs-left pt-2 pl-4">
                    <v-layout row wrap >
                      <!-- <v-icon >keyboard_arrow_right</v-icon> -->
                      <div class='commentAvatar'>
                        <img v-bind:src="reply.avatar" class='commentAvatarSize'>
                      </div>
                      <h4 class='mb-1 commentNickname' >{{reply.nickname}}</h4>
                      <span class='ml-2 grey--text text--darken-1' style='font-size:0.9em;line-height:40px;'>{{reply.moment}}</span>
                    </v-layout>
                    <p v-html="reply.article" class='mt-1'  v-bind:class="[{'grey--text text--lighten-2':reply.isDeleted }]"></p>

                    <v-layout row wrap justify-space-between style='margin-top:-5px;'>
                      <div class="text-xs-left">
                        <v-btn small fab class='commentBtn' v-on:click='replyVote(1, idx, reIdx, reply.replyId)' v-bind:disabled='reply.isDeleted' v-bind:loading="reply.score.upLoader"><v-icon>keyboard_arrow_up</v-icon></v-btn>
                        <span v-bind:class="[{'blue--text':reply.score.good.length>0 }]">{{reply.score.good.length}}</span>
                        <v-btn small fab class='commentBtn' v-on:click='replyVote(2, idx, reIdx, reply.replyId)' v-bind:disabled='reply.isDeleted'  v-bind:loading="reply.score.downLoader"><v-icon>keyboard_arrow_down</v-icon></v-btn>
                        <span>{{reply.score.bad.length}}</span>
                        <!-- <strong class='ml-1 ' v-bind:class="[{'blue--text':comment.score.total>0 }]">{{comment.score.total}}</strong> -->
                      </div>
                      <div class='text-xs-right '>
                        <v-btn v-if='userAccount && userAccount == reply.user && !reply.isDeleted' fab small class=' commentBtn'  v-on:click='deleteReply(idx, reIdx, reply.replyId)' >
                          <v-icon >delete</v-icon>
                        </v-btn>
                        <v-btn fab small class=' commentBtn' v-if='!reply.isDeleted'   v-on:click='replyComment2(idx, reIdx)' >
                          <v-icon >chat_bubble </v-icon>
                        </v-btn>
                      </div>

                    </v-layout>

                  <!-- 답글의 답글 -->
                    <v-layout row wrap v-show='reply.isWritingReply' class='mt-2' >
                      <v-flex xs10>
                        <v-textarea
                          color="blue"
                          v-model='reply.replyText'
                          v-bind:row-height=30
                          v-bind:rows=1
                          v-bind:loading="loader.replyTextarea"
                          name="commentTxt"
                          class='commentTxt'
                          v-bind:label="`Reply to ${reply.nickname}`"
                        ></v-textarea>

                      </v-flex>
                      <v-flex xs1>
                        <v-btn fab small dark color="blue darken-4" v-on:click="postReply2(idx, reIdx, reply.replyId, comment._id, reply.nickname)" class='commentPostBtn mr-0' v-bind:class="{'mr-3': $vuetify.breakpoint.xs}" title=' It doesn&#39;t need to sign in' ><v-icon>edit</v-icon></v-btn>

                      </v-flex>
                    </v-layout>

                  </div>
                </div>
                <!-- 코멘츠 답글 끝 -->
              </div>

            </v-layout>
          </v-flex>

        </v-flex>
      </v-layout>


      <!-- 모바일 베팅 팝업창 -->
        <!-- <v-bottom-sheet v-model="popBet" > -->
        <v-dialog v-model="popBet" >
          <v-card
            class="blue darken-4 hidden-md-down"
            dark
          >
            <!-- 베팅중 나타나는 화면연출 -->
            <div v-html='betMask'></div>
            <!-- 로그인 부터 하세요 -->
            <div class='inPlay' v-if='loginWindow'>
              <h3 class='mt-4 text-xs-center waitingConfirm'>Please log in to Trust wallet</h3>
              <v-btn large class='placeBetTxt coinIcon mt-4' color='pink darken-2' v-on:click='loginFirst'>
                Confirm
              </v-btn>
            </div>
            <!-- 베팅 취소화면 -->
            <div class='inPlay' v-if='cancelWindow'>
              <h3 class='mt-4 text-xs-center waitingConfirm'>Your bet has been canceled</h3>
              <v-btn large class='placeBetTxt coinIcon mt-4' color='pink darken-2' v-on:click='cancelWindow = false; dataAnalysis(1502);'>
                Play again
              </v-btn>
            </div>
            <!-- 계약 최종 성공화면 -->
            <div class='inPlay' v-if='finalBetInfo.bool'>
              <div class='closeBetBtn'>
                <v-btn fab small class='blue darken-4' v-on:click='finalBetInfo.bool = false;dataAnalysis(1503);' >
                  <v-icon >close</v-icon>
                </v-btn>
              </div>
              <h3 class='text-xs-center waitingConfirm' style='margin-top:30px;'>This contract
                <a v-bind:href="'https://etherscan.io/address/'+ contract.to" target='_blank' v-on:click='dataAnalysis(1504)'>
                  <v-icon size='24px' class='iCodeLink' color='yellow'>transit_enterexit</v-icon>
                </a>
                was concluded.
              </h3>
              <!-- <v-icon size='80px' class='mt-4 text-xs-center' color='rgba(255,255,0,0.5)' style='z-index:-5;position:absolute;;'>thumb_up</v-icon> -->
              <img src="https://whitebetting.s3.amazonaws.com/game/inGame/guarantee.png" alt='This contract is guaranteed' class='guaranteeImg' />

              <h3 class='mt-3 text-xs-center waitingConfirm yellow--text' style='font-size:20px;'>
                <span >{{ finalBetInfo.teamName }}</span>
                <span class='white--text font-weight-normal' v-if='finalBetInfo.selectedTeam == 1 || finalBetInfo.selectedTeam == 3'>&nbsp;Win</span>
              </h3>
              <h4 class='mt-2 text-xs-center' style='font-size:18px;'>
                <span class='yellow--text' >{{ betEth }}</span>
                <span style='font-size:15px;' >&nbsp;ETH</span>
                <span style='font-size:15px;'>&nbsp;&nbsp;x&nbsp;</span>
                <span class='yellow--text' >{{ finalBetInfo.teamOdd }}</span>
              </h4>

              <h4 class='text-xs-center' style='font-size:20px;'>
                <span style='font-size:15px;' >&nbsp;=&nbsp;</span>
                <span class='yellow--text' >{{ finalBetInfo.betResult }}</span>
                <span style='font-size:15px;' >&nbsp;ETH</span>
              </h4>

              <h4 class='mt-2 text-xs-center' style='font-size:12px;'>
                <span>Payouts will be made within 30 minutes after the match finish.</span>
              </h4>
            </div>
            <!-- 보상금액 초과로 베팅이 불가능한 게임 -->
            <div class='inPlay' v-if='unableBetWindow'>
              <h3 class='mt-4 text-xs-center waitingConfirm'>I'm sorry, but you've bet more than we can pay.</h3>
              <h4 class='mt-4 text-xs-center waitingConfirm'>Please try to lower your stake or choose another match of low odds!</h4>
              <v-btn large class='placeBetTxt coinIcon mt-4' color='pink darken-2' v-on:click='unableBetWindow = false;dataAnalysis(1510);'>
                Play again
              </v-btn>
            </div>
            <!-- Odd가 변경되어 베팅 불가능한 게임 -->
            <div class='inPlay' v-if='incorrectOddWindow'>
              <h3 class='mt-4 text-xs-center waitingConfirm'>Odds have changed.<br/> Please page reload.</h3>
              <v-btn large class='placeBetTxt coinIcon mt-4' color='pink darken-2' v-on:click='pageReload();dataAnalysis(1511);'>
                Page reload
              </v-btn>
            </div>
            <!-- 베팅중 나타나는 화면연출 끝 -->

            <div class='closeBetBtn'>
              <v-btn fab small class='blue darken-4 closePopupBtn' v-on:click='popBet = false;dataAnalysis(1527);' >
                <v-icon  >close</v-icon>
              </v-btn>
            </div>

            <!-- 베팅창 베팅 정보! -->
            <v-card-text class="title font-weight-bold yellow--text text-xs-left">
              {{ betInfo.teamName }} <span class='white--text font-weight-normal' v-if='betInfo.selectedTeam == 1 || betInfo.selectedTeam == 3'>Win</span>
            </v-card-text>

            <h4 class='mx-3 mb-2 kindOfGame text-xs-left' v-if='betInfo.selectedTeam != 4 && betInfo.selectedTeam != 5'> Full Time Result</h4>
            <h4 class='mx-3 mb-2 kindOfGame text-xs-left' v-if='betInfo.selectedTeam == 4 || betInfo.selectedTeam == 5'> Goals Over/Under</h4>

            <v-layout row wrap>
              <h3 class='mx-3 yellow--text'>
                <v-icon class='fab fa-ethereum'></v-icon>
                <span > x {{ betInfo.teamOdd }}</span>
              </h3>
              <h4 class='toReturnTxt'>To Return</h4>
              <h2 class='toReturnNum' >{{ betResult }}</h2>
              <h4 class='toReturnUnitTxt'>ETH</h4>
            </v-layout>
            <!-- Mobile 팝업 -->
            <v-layout row wrap  class='pt-2 ml-2'>
              <a class='quickBetBtn mr-3' v-on:click='ethSetFuc(1)'><button>Min</button></a>
              <a class='quickBetBtn' v-on:click='ethSetFuc(2)'><button>+0.05</button></a>
              <a class='quickBetBtn' v-on:click='ethSetFuc(3)'><button>+0.50</button></a>
              <a class='quickBetBtn ml-3' v-on:click='ethSetFuc(4)'><button>Max</button></a>
            </v-layout>

            <v-card-actions class='pt-0'>
              <v-layout column wrap>
                <v-layout row wrap>
                  <v-flex xs3>
                    <v-hover>
                      <a v-on:click='minusFunc' slot-scope="{ hover }">
                        <button>
                          <v-icon class='quickBetAddBtn' v-bind:class="`${hover ? 'pink--text' : 'white--text'}`" v-on:mousedown="intervalStart(1)" v-on:mouseup="intervalStop(1)" v-on:touchstart="intervalStart(1)" v-on:touchend="intervalStop(1)" v-on:touchcancel="intervalStop(1)">remove</v-icon>
                        </button>
                      </a>
                    </v-hover>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      class='betEthTxt mb-2 mx-1 '
                      v-model='betEth'
                      type='number'
                      label="ETH"
                      v-on:click:clear ="clearEth"
                      v-on:keyup='checkEth'
                      v-on:keyup.enter.native='placeBet(gameInfo._id, gameInfo.fixture_id, betInfo.selectedTeam, betInfo.teamName, betEth, betInfo.teamOdd)'
                      v-on:blur='onBlurEthTxt'
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs3>
                    <v-hover>
                      <a v-on:click='plusFunc' slot-scope="{ hover }">
                        <button>
                          <v-icon class='quickBetAddBtn' v-bind:class="`${hover ? 'yellow--text' : 'white--text'}`" v-on:mousedown="intervalStart(2)" v-on:mouseup="intervalStop(2)" v-on:touchstart="intervalStart(2)" v-on:touchend="intervalStop(2)" v-on:touchcancel="intervalStop(2)">add</v-icon>
                        </button>
                      </a>
                    </v-hover>
                  </v-flex>
                </v-layout>

                <v-btn large class='placeBetTxt' color='pink darken-2'
                  v-on:click='placeBet(gameInfo._id, gameInfo.fixture_id, betInfo.selectedTeam, betInfo.teamName, betEth, betInfo.teamOdd)'
                  v-bind:loading="loader.placeBet"
                >
                  Place Bet All Test!
                </v-btn>      
                <p v-show=true class='mt-1 extraInfo text-xs-left'>*1st half, 2nd half (excluding Extra time, P.K.)</p>

              </v-layout>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- mobile popup -->

        <!-- youtube popup -->
        <v-dialog
          v-model="youtube.status"
          width="500"
        >
          <v-card>
            <div class='closeBetBtn'>
              <v-btn fab small class=' closePopupBtn'  v-on:click='youtube.status = false;youtube.embeded =""' >
                <v-icon >close</v-icon>
              </v-btn>
            </div>
            <v-card-title
              class="grey lighten-2"
              primary-title
            >
              {{youtube.title}}
            </v-card-title>
            <div v-html='youtube.embeded'></div>

            <v-card-text>
              {{youtube.description}}
            </v-card-text>
          </v-card>
        </v-dialog>



    </v-layout>
    <!-- facebook -->

    <!-- preloading -->
    <img v-show=false src="https://whitebetting.s3.amazonaws.com/game/inGame/guarantee.png" />
		<!-- adding loading icon -->
		<Loading v-if='loadingStatus'/>

  </div>
</template>

<script>
import * as Contract from '@/web3/web3_contract';

// import web3client from '@/web3/web3_client';
import gameAPI from '@/commons/gameAPI';
import GameData from '@/commons/gameData';
import mixinComment from '@/commons/mixinComment';
import mixinDataAnal from '@/commons/mixinDataAnal';
import util from '@/commons/util';
import { Carousel, Slide } from 'vue-carousel';

// const Web3Client = new web3client();
const GameAPI    = new gameAPI();
const Util       = new util();

import Web3  from 'web3';
import { mapState, mapActions, mapMutations } from 'vuex';
// import { clearInterval } from 'timers';
import Loading from '@/components/Loading'


const isMobile = (window.innerWidth < 1264) ? true : false;
const isCC = (window.innerWidth < 560) ? true : false;// 모바일에서만 아래에서 팝업으로 뜨기
// PC팝업. 아래의 방식으로 vuetify의 태그들은 적용이 되지 않는다. 따라서 [2]와 [4]는 v-if로 처리했다 ㅠ
const htmlEl = [
  // 0.
  { tag : `` },
  // 1.Please confirm your bet
  { tag : `<div class='inPlay'><h3 class='mt-4 text-xs-center waitingConfirm'>Please confirm your bet</h3><img src="https://whitebetting.s3.amazonaws.com/game/inGame/coinIcon.svg" alt='waiting for your confirm' class='coinIcon'/></div>`},
  // 2. Your bet has been canceled
  { tag : `<div class='inPlay'><h3 class='mt-4 text-xs-center waitingConfirm'>Your bet has been canceled</h3><button type="button" class="placeBetTxt coinIcon mt-4 v-btn v-btn--large theme--dark pink darken-2"><div class="v-btn__content">Play again</div></button></div>`},
  // 3. Bet submitted!
  { tag : `<div class='inPlay'><h3 class='mt-3 text-xs-center waitingConfirm'>Bet submitted! <a href='https://etherscan.io/tx/###' target='_blank'><i aria-hidden="true" class="v-icon iCodeLink material-icons theme--light yellow--text" style="font-size: 24px;">transit_enterexit</i></a></h3> <img src="https://whitebetting.s3.amazonaws.com/game/inGame/coinIcon_confirm.svg" alt='waiting for your confirm' class='coinIcon'/> <h3 class='text-xs-center waitingConfirm'>Waiting for Ethereum...</h3></div>`},
  // 4. This contract was concluded.
  { tag : `<div class='inPlay'><h3 class='mt-4 text-xs-center waitingConfirm'>This contract was concluded.<a href='https://etherscan.io/tx/###' target='_blank'><i aria-hidden="true" class="v-icon iCodeLink material-icons theme--light yellow--text" style="font-size: 24px;">transit_enterexit</i></a></h3><i aria-hidden="true" class="mt-2 v-icon material-icons theme--light white--text" style="font-size: 90px;display:block;text-align:center;">thumb_up</i></div>`},
  // 5. 날짜가 지난 경기
  { tag : `<div class='inPlay'><h3 class='mt-5 text-xs-center waitingConfirm'>The betting date is over.</h3><h3 class='mt-2 text-xs-center waitingConfirm'>Please choose another match!</h3></div>`},
  // 6. Pending 게임. 배당률이 결정되지 않았습니다에서 변경
  { tag : `<div class='inPlay'><h3 class='mt-5 text-xs-center waitingConfirm'>Pending match.</h3><h3 class='mt-2 text-xs-center waitingConfirm'>Please wait to open this match.</h3></div>`},
  // { tag : `<div class='inPlay'><h3 class='mt-5 text-xs-center waitingConfirm'>The odd has not been decided yet.</h3><h3 class='mt-2 text-xs-center waitingConfirm'>Please choose another match!</h3></div>`},
  // 7.경기 10분전
  { tag : `<div class='inPlay'><h3 class='mt-5 text-xs-center waitingConfirm'>10 minutes before match start.</h3><h3 class='mt-2 text-xs-center waitingConfirm'>Betting closed.</h3></div>`},
  // 8.경기 중
  { tag : `<div class='inPlay'><h3 class='mt-5 text-xs-center waitingConfirm'>In-Play!</h3><h3 class='mt-2 text-xs-center waitingConfirm'>Betting closed.</h3></div>`},
  // 9.경기 종료. 보상 대기중.
  // { tag : `<div class='inPlay'><h3 class='mt-5 text-xs-center waitingConfirm'>Game over.</h3><h3 class='mt-2 text-xs-center waitingConfirm'>Compensation after about 30 min. according to result.</h3></div>`},
  { tag : `<div class='inPlay'><h3 class='mt-5 text-xs-center waitingConfirm'>Payouts will be made within about 30 minutes after the match finish.</h3></div>`},
  // 10.보상 완료.
  { tag : `<div class='inPlay'><h3 class='mt-5 text-xs-center waitingConfirm'>Winnings were paid completely.</h3><h3 class='mt-2 text-xs-center waitingConfirm'>Match closed.</h3></div>`},
  // 11. disuse 게임
  { tag : `<div class='inPlay'><h3 class='mt-5 text-xs-center waitingConfirm'>Not an available match.</h3><h3 class='mt-2 text-xs-center waitingConfirm'>Please choose another match!</h3></div>`},
  // 12. 보상금액 초과로 베팅이 불가능한 게임
  // { tag : `<div class='inPlay'><h3 class='mt-5 text-xs-center waitingConfirm'>I'm sorry, but you've bet more than we can pay.</h3><h3 class='mt-2 text-xs-center waitingConfirm'>Please try to lower your stake or choose another match of low odds!</h3><button type="button" class="placeBetTxt coinIcon mt-4 v-btn v-btn--large theme--dark pink darken-2"><div class="v-btn__content">Play again</div></button></div>`},
]

// const htmlEl_kor = [
//   { tag : "<div class='inPlay'><h4 class='waitingConfirm'>내기 금액을 확인하세요</h4></div>"},
//   { tag : "<div class='inPlay'><h4>거래가 취소되었습니다</h4><v-btn>Play again<v-/btn></div>"},
//   { tag : "<div class='inPlay'><h4>Bet submitted! Waiting for Ethereum...</h4></div>"},
//   { tag : "<div class='inPlay'><h4>You lost or You win</h4></div>"},
// ]

export default {
  name : 'Football',
  mixins: [mixinComment, mixinDataAnal],
  components: { Loading, Carousel, Slide },
  data () {
    return {
      isCC              : '',
      betMask           : '',
      drawer            : false,
      loading           : false,
      sns               : { telegram : '', twitter : '', facebook: { href : '', title : '', description : '',}, },
      twitterUrl        : '',

      gameInfo          : {},
      homeStatInfo      : '',
      awayStatInfo      : '',

      league            : {name : '', country: ''},
      media             : {guardian : [], youtube: [], },
      gameStatusId      : '',
      gameStatus        : '',
      gameResult        : {},

      snackbar          : false,
      result            : '',
      pcPopBet          : false,
      popBet            : false,
      checkInterval     : { minus : false, plus : false},

      youtube           : {status : false, title : '', embeded :'', description: '',},

      // fixtureId         : '',
      betInfo           : {},
      prevBetInfo       : {},
      betEth            : '',
      betResult         : 2,

      isShowTrustWallet : ''   ,// 지갑설치 문구를 보여줄지 말지는 지갑의 존재여부와 또 다르다.
      isShowMetaMask    : ''   ,
      isGetMetamask     : ''   ,

      hashTx            : false,
      loginWindow       : false,
      cancelWindow      : false,
      unableBetWindow   : false,
      incorrectOddWindow: false,
      web3js            : '',
      myWhite           : '',
      contractInfo      : '',

      finalBetInfo      : {bool : false,  teamName : '', stake : '', odd: '', }   ,
      contract          : {}   ,

      pagination: {
        stats :{rowsPerPage : 5, history : {rowsPerPage : 5} }
      },

      expand            : false,
      betHeaders : [
        {text: `Bet`  , align: 'center', sortable: false, value: 'bet'  },
        {text: 'Count', align: 'center', sortable: false, value: 'count'},
        {text: 'Stake', align: 'center', sortable: false, value: 'stake'},
      ],
      betInfoGames      : [],
      headers: [
        { text : 'No.'   , align: 'center', sortable: true , value: 'number'               },
        { text : 'Player', align: 'center', sortable: true , value: 'user'                 },
        { text : 'Bet'   , align: 'center', sortable: true , value: 'teamName'             },
        { text : 'Stake' , align: 'center', sortable: true , value: 'stake'                },
        { text : 'Odd'   , align: 'center', sortable: false, value: 'odd'                  },
        { text : 'Market', align: 'center', sortable: false, value: 'market'  , hide: 'xs' },
        { text : 'Returns', align: 'center', sortable: false, value: 'returnEth'           },
      ],
      betHistory   : [],
      allHistory   : '',

      textareaTxt : '',
      comments: [],
      commentsCount : 0,//모든 코멘트 개수

      loader :{ gameBetInfo : false, placeBet : false, gameStat : false, commentTextarea : false, replyTextarea: false,  },
    }
  },
  methods: {
		...mapActions([ // store.js에 있는 changeLoadingStatus함수로 CHANGE_LOADING_STATUS를 바꾸면 loadingStatus가 바뀐다.
			'changeLoadingStatus', 'vuexWhite',
		]),
    ...mapMutations ([
      'CHANGE_LOADING_STATUS', 'WHITE', // 로딩화면 추가
		]),
    // 로그인부터 하세요
    loginFirst(){
      this.dataAnalysis(1501);
      this.loginWindow = false;
      this.pcPopBet    = false;
      this.popBet      = false;
      this.clearEth();
    },
    popUpYoutubeWindow(what){
      this.dataAnalysis(1302);
      this.youtube.status = !this.youtube.status;
      this.youtube.title = this.media.youtube[what].title;
      this.youtube.embeded = this.media.youtube[what].embeded;
      this.youtube.description = this.media.youtube[what].description;

    },
    intervalStart(what){
      if(what == 1){
        if(!this.checkInterval.minus){
          this.checkInterval.minus = setInterval(this.minusFunc, 300)	;
        }
      } else{
        if(!this.checkInterval.plus){
          this.checkInterval.plus = setInterval(this.plusFunc, 300)	;
        }
      }
    },
    intervalStop(what){
      if(what ==1){
        clearInterval(this.checkInterval.minus);
        this.checkInterval.minus = false;
      } else{
        clearInterval(this.checkInterval.plus);
        this.checkInterval.plus = false;
      }
    },
    minusFunc(){
      this.dataAnalysis(1525);
      const fBetEth = parseFloat(this.betEth);
      if ( isNaN(fBetEth) ) this.betEth = "0.01";
      else if(fBetEth <= 0) this.betEth = "0.01";
      else {
        if (fBetEth<=0.01) this.betEth = "0.01";
        else this.betEth = (fBetEth - 0.01).toFixed(2).toString();
        }
      // 아래는 0.05가 기본값
      // if ( isNaN(fBetEth) ) this.betEth = "0.01";
      // else if(fBetEth <= 0) this.betEth = "0.05";
      // else {
      //   if (fBetEth<=0.05) this.betEth = "0.01";
      //   else this.betEth = (fBetEth - 0.05).toFixed(2).toString();
      //   }
      this.checkEth();
    },
    plusFunc(){
      this.dataAnalysis(1526);
      const fBetEth = parseFloat(this.betEth);
      if ( isNaN(fBetEth) ) this.betEth = "0.01";
      else if(fBetEth <= 0) this.betEth = "0.01";
      else if(fBetEth >= 4.95) this.betEth = "5";
      else {
        this.betEth = (fBetEth + 0.01).toFixed(2).toString();
        }
      // if ( isNaN(fBetEth) ) this.betEth = "0.05";
      // else if(fBetEth <= 0) this.betEth = "0.05";
      // else if(fBetEth >= 4.95) this.betEth = "5";
      // else {
      //   this.betEth = (fBetEth + 0.05).toFixed(2).toString();
      //   }
      this.checkEth();
    },
    // ETH 기본 셋 버튼
    ethSetFuc(howMuch){
      let tempSum;
      switch(howMuch){
        case 1 : this.betEth = "0.01"; this.dataAnalysis(1521); break;
        case 2 :
          tempSum = (+this.betEth + 0.05);
          if(tempSum > 5 ) this.betEth = 5;
          else this.betEth = tempSum.toFixed(2).toString();
          this.dataAnalysis(1522);
          break;

        case 3 :
          tempSum = (+this.betEth + 0.5);
          if(tempSum > 5 ) this.betEth = 5;
          else this.betEth = tempSum.toFixed(2).toString();
          this.dataAnalysis(1523);
          break;
        case 4 : this.betEth = "5"; this.dataAnalysis(1524); break;
      }
      // switch(howMuch){
      //   case 1 : this.betEth = "0.05"; break;
      //   case 2 : this.betEth = "0.1"; break;
      //   case 3 : this.betEth = "1"; break;
      //   case 4 : this.betEth = "5"; break;
      // }
      this.checkEth();
    },
    // 내 배팅 history 보기
    showBetHistory(isWhat){
      // this.isAllHistory = !this.isAllHistory;
      if ( isWhat ){
        this.dataAnalysis(1204);
        this.betHistory = this.allHistory;
      } else {
        this.dataAnalysis(1205);
        const user = new Array();
        this.allHistory.map( d =>{
          if ( d.user == this.userAccount ){
            user.push(d);
          }
        })
        this.betHistory = user;
      }
    },
    // returnEth 계산
    calReturnETh(eth){
      if (eth == 0 ) return 0;
      else if (eth == undefined) return 'Not yet';
      else if (eth == -1) return 'Refunded';
      else return eth;
    },

    // 팀 선택 팝업
    async selectTeam(selectedTeam, teamName, teamOdd) {
      
      this.dataAnalysis(1100+selectedTeam);// 1은 homeTeam, 2는 drawTeam, 3은 awayTeam, 4는 over, 5는 under, 6은 homeTeamAndDraw, 7은 homeAndAwayTeam, 8은 awayTeamAndDraw, 0은 항상null

      this.prevBetInfo = this.betInfo;// 이전 팀 선택 정보를 저장해 놓은 후
      this.betInfo = {
        selectedTeam  : selectedTeam,
        teamName      : teamName,     // 선택한 팀이름
        teamOdd       : teamOdd,      // 선택한 팀의 배팅률
      }
      this._returnEth(this.betInfo);
      this.popBet = isMobile ? true : false;// 모바일에서만 하단 팝업

      // 같은 팀일때는 팝업 on/off, 다른 팀일 경우에는 정보 갱신 후 계속 팝업
      if ( !isMobile ){
        this.pcPopBet = (this.prevBetInfo.selectedTeam == this.betInfo.selectedTeam ) ? !this.pcPopBet : true;
      }
    },

    // 테스트용 placeBetTest
    async placeBet( fixtureObjId, fixtureId, selectedTeam, teamName, stake, odd ){
      // this.dataAnalysis(1);
      // gtag('event','액션',{ "event_category":  "카테고리"});

      if (this.gameInfo.open_status != 3) { // 경기 날짜가 지났을 경우 베팅을 못하게 막는다.
        return;
      }

      // FB.AppEvents.logEvent("buttonClicked"); // fb 맞춤이벤트

       // 실수형으로 바꿀 수 없는 stake는 0.01로 바꾼다.
      if ( !parseFloat(stake) ) {
        this.betEth = '0.01';
        stake = 0.01;
      } else {
        this.betEth = stake;
      }

      // 베팅 가능 검토
      this.loader.placeBet = true;
      console.log(1);
      const isAbleBet = await GameAPI.getMaxPot(fixtureId , selectedTeam , stake, odd);
      console.log(2);
      this.loader.placeBet = false;
      console.log(isAbleBet);
      if(isAbleBet.oddCheck && isAbleBet.maxPotCheck){ // 현재 베팅하려는 금액이 보상 가능한 금액이라면
        this.betMask = htmlEl[1].tag; // 메타마스크의 선택을 기다리는 화면
        let betTransaction;
        let market;
        if (selectedTeam == 4 || selectedTeam == 5 ) {
          market = 'Goals Over/Under';
        } else if (selectedTeam == 6 || selectedTeam == 7 || selectedTeam == 8 ){
          market = 'Double Chance';
        } else { market = 'Full Time Result'; }
        // const market = (selectedTeam == 4 || selectedTeam == 5 ) ? 'Goals Over/Under' : 'Full Time Result';
        // this.betMask = htmlEl[0].tag;
        // this.finalBetInfo.bool = true;

        try{
          const stakeEth = this.web3js.utils.toWei(stake, 'ether');
          const from = this.userAccount;
          const to = this.contractInfo.address;
          betTransaction = await this.web3js.eth.sendTransaction({
              from  : from,
              to    : to,
              value : stakeEth,
            })
            .on('transactionHash', async (hash)=>{
              console.log('테스트 트랜잭션!: '+ hash);
              this.hashTx = hash;
              // 여기서는 tx만 저장해 놓고. 서버에서 확인할때는 isReal은 undefinded여야하고 tx만 있어야 하고 아래 영수증을 받은 후에는 다시 tx를 확인해서 정보가 일치하는지 보고 true라면 isReal이 true라는 태그를 붙여주자.
              // 아래와 같이 tx를 이용해 timeStamp를 구해서 이게 gametime stamp 10분전 베팅인지 확인하자.
// > let tx = "0x5da2844afb6826d4baed6ad7e8b536c00cbc921ac147773ad056f29f2e7c1762"
// > web3.eth.getTransaction(tx).blockNumber
// 1920050
// > web3.eth.getBlock(1920050).timestamp
// 1469021581     
// 1583307953866         
              // 이제 유저가 나한테 돈을 보냈을 때 이 돈이 특정 게임에 보낸 것인지 확인하는 절차를 찾아낸다.
              // 즉 오래전에 보낸 전 있는 tx를 이용해 가짜로 정보를 날릴 경우
              // 이런 tx에는 보상을 하지 않아야 한다.
              // txInfo를 받았을 때에만 db에 저장하자. 
              // 만약 영수증을 못받은 경우 일단 tx를 저장해 놓았으니
              // 다음 보상할 때 tx를 확인하여 베팅이 되어있다면 돈을 보낸다. 20.02.24
              // 내일 구현하자.
              GameAPI.checkTx( from, isMobile, fixtureId, fixtureObjId, selectedTeam, odd, stake, teamName, market, hash );
            })
            .on('confirmation', function(confNumber, receipt){
              // console.log(confNumber);
            })
            .on('receipt', (receipt) => {
              console.log('영수증');
              console.log(receipt);
              // 영수증이 real이 되면 그때 확정해서 처리하면 되겠다. 함수를 2개로 쪼개서
              // isReal이 확정되었다는 tag를 넣어주자. 이런 경우 
              GameAPI.setBetInfoTest( this.hashTx );              
              this._getUserWhite();
            })
            .on('error', (err)=>{ // 결제를 취소했을 때
              console.log('결제취소');
              this.betMask = htmlEl[0].tag;
              return;
            });
          // console.log('결제끝');

        } catch(err) { // 지갑에 로그인하지 않았을 때
          console.log(err);
            this.betMask = htmlEl[0].tag;
          // this.loginWindow = false;
              if(this.isWalletLogin){
                this.cancelWindow = true;
              } else{
                // console.log('지갑에 로그인하지 않았을 때');
                this.err = err;
                // this.betMask = htmlEl[0].tag;
                this.loginWindow = true;
              }
          return;
        }

        // console.log('성공후 여기');
        // confirm 후 거래가 완료되었다.
        this.betMask = htmlEl[0].tag;
        this.finalBetInfo.bool = true;
        this.finalBetInfo.selectedTeam = selectedTeam;
        this.finalBetInfo.teamName = teamName;
        this.finalBetInfo.stake = stake;
        this.finalBetInfo.odd = odd;
        this.finalBetInfo.betResult = this.betResult;

        this.contract.to = betTransaction.to; // contract address
        const newBetInfo = {
          number: this.betHistory.length+1 ,user: this.userAccount, selectedTeam: parseInt(selectedTeam), teamName: teamName, stake: parseFloat(stake), odd: parseFloat(odd), market: market, returnEth: 'Not yet', transaction: this.hashTx
        };
        this.betHistory.unshift(newBetInfo);// 맨앞에 추가
        this.betInfoGames = this._getGameStat();
        // 새로 추가된 betHistory 의 색을 2초간 분홍색으로 칠했다가 돌려놓기
        const a = document.querySelector('.newAppendedBet');
        if(a) {
          a.style.backgroundColor = '#f7c8d8';
          setTimeout(() => {
            a.style.backgroundColor = '#fff';
          }, 5000);
        }
      // } else if(!isAbleBet.oddCheck) { // odd가 변경된 상태라면
      //   this.incorrectOddWindow = true;
      // } else {
      //   // this.gameStatus = 'Not an available game.';
      //   this.unableBetWindow = true;
      // }
      }

    },


    // async placeBet( fixtureObjId, fixtureId, selectedTeam, teamName, stake, odd ){
    //   this.dataAnalysis(1);
    //   gtag('event','액션',{ "event_category":  "카테고리"});
    //   if (this.gameInfo.open_status != 3) { // 경기 날짜가 지났을 경우 베팅을 못하게 막는다.
    //     return;
    //   }
    //   FB.AppEvents.logEvent("buttonClicked"); // fb 맞춤이벤트

    //    // 실수형으로 바꿀 수 없는 stake는 0.01로 바꾼다.
    //   if ( !parseFloat(stake) ) {
    //     this.betEth = '0.01';
    //     stake = 0.01;
    //   } else {
    //     this.betEth = stake;
    //   }

    //   // 베팅 가능 검토
    //   // const isOddCheck = await GameAPI.getOddCheck(fixtureId, selectedTeam, odd);
    //   this.loader.placeBet = true;
    //   const isAbleBet = await GameAPI.getMaxPot(fixtureId , selectedTeam , stake, odd);
    //   this.loader.placeBet = false;
    //   // console.log(isAbleBet);
    //   if(isAbleBet.oddCheck && isAbleBet.maxPotCheck){ // 현재 베팅하려는 금액이 보상 가능한 금액이라면
    //     this.betMask = htmlEl[1].tag; // 메타마스크의 선택을 기다리는 화면
    //     let betTransaction;
    //     let market;
    //     if (selectedTeam == 4 || selectedTeam == 5 ) {
    //       market = 'Goals Over/Under';
    //     } else if (selectedTeam == 6 || selectedTeam == 7 || selectedTeam == 8 ){
    //       market = 'Double Chance';
    //     } else { market = 'Full Time Result'; }
    //     // const market = (selectedTeam == 4 || selectedTeam == 5 ) ? 'Goals Over/Under' : 'Full Time Result';
    //     // this.betMask = htmlEl[0].tag;
    //     // this.finalBetInfo.bool = true;

    //     try{
    //       const stakeEth = this.web3js.utils.toWei(stake, 'ether');
    //       // betTransaction = await this.web3js.eth.sendTransaction({});//★ {}안에 아래 정보를 넣어면 된다
    //       betTransaction = await this.wbContract.methods.placeBet(fixtureId, selectedTeam, parseInt(odd*1000))
    //         .send({
    //           from  : this.userAccount,
    //           to    : this.contractInfo.address,
    //           value : stakeEth,

    //           // gasLimit: this.web3js.utils.toHex(3000000),
    //           // gasPrice: this.web3js.utils.toHex(this.web3js.utils.toWei('20', 'gwei')),
    //         })
    //         .on('transactionHash', async (hash)=>{ // metamask에서 confirm을 누르면 hash가 나온다.
    //           // console.log('트랜잭션!');
    //           this.hashTx = hash;
    //           GameAPI.setBetInfo( this.userAccount, fixtureObjId, fixtureId, selectedTeam, teamName, stake, odd, market, hash );
    //         })
    //         .on('confirmation', function(confNumber, receipt){
    //           // console.log(confNumber);
    //         })
    //         .on('receipt', (receipt) => {
    //           // console.log(receipt);
    //           this._getUserWhite();
    //         })
    //         .on('error', (err)=>{ // 결제를 취소했을 때
    //           // console.log('결제취소');
    //           this.betMask = htmlEl[0].tag;
    //           return;
    //         });
    //       // console.log('결제끝');

    //     } catch(err) { // 지갑에 로그인하지 않았을 때
    //       console.log(err);
    //         this.betMask = htmlEl[0].tag;
    //       // this.loginWindow = false;
    //           if(this.isWalletLogin){
    //             this.cancelWindow = true;
    //           } else{
    //             // console.log('지갑에 로그인하지 않았을 때');
    //             this.err = err;
    //             // this.betMask = htmlEl[0].tag;
    //             this.loginWindow = true;
    //           }
    //       return;
    //     }

    //     // console.log('성공후 여기');
    //     // confirm 후 거래가 완료되었다.
    //     this.betMask = htmlEl[0].tag;
    //     this.finalBetInfo.bool = true;
    //     this.finalBetInfo.selectedTeam = selectedTeam;
    //     this.finalBetInfo.teamName = teamName;
    //     this.finalBetInfo.stake = stake;
    //     this.finalBetInfo.odd = odd;
    //     this.finalBetInfo.betResult = this.betResult;

    //     this.contract.to = betTransaction.to; // contract address
    //     const newBetInfo = {
    //       number: this.betHistory.length+1 ,user: this.userAccount, selectedTeam: parseInt(selectedTeam), teamName: teamName, stake: parseFloat(stake), odd: parseFloat(odd), market: market, returnEth: 'Not yet', transaction: this.hashTx
    //     };
    //     this.betHistory.unshift(newBetInfo);// 맨앞에 추가
    //     this.betInfoGames = this._getGameStat();
    //     // 새로 추가된 betHistory 의 색을 2초간 분홍색으로 칠했다가 돌려놓기
    //     const a = document.querySelector('.newAppendedBet');
    //     if(a) {
    //       a.style.backgroundColor = '#f7c8d8';
    //       setTimeout(() => {
    //         a.style.backgroundColor = '#fff';
    //       }, 5000);
    //     }
    //   } else if(!isAbleBet.oddCheck) { // odd가 변경된 상태라면
    //     this.incorrectOddWindow = true;
    //   } else {
    //     // this.gameStatus = 'Not an available game.';
    //     this.unableBetWindow = true;
    //   }

    // },
    pageReload(){
      // this.$router.go();
      this._fetchData();
      this.pcPopBet = false;
      this.popBet = false;
      this.incorrectOddWindow = false;
    },
    onBlurEthTxt(){
      this._returnEth(this.betInfo);
    },
    checkEth() {
      this._returnEth(this.betInfo);
    },
    _returnEth(betInfo) {// 베팅으로 얻게될 ETH보여주기 내부함수
      const stake = parseFloat(this.betEth);
      if(stake){ // 입력창 데이터 제한 적용
        if( parseInt(stake*100) <= 0 ){ // 0보다 작은 0.01의 경우 0.01로 stake 변경
          this.betEth = 0.01;
        } else if ( Math.floor(stake*100) != (stake*100) ){ // 10.006일 경우 10.01로 stake 변경
          this.betEth = stake.toFixed(2);
          // this.betEth = Math.floor(stake*100)/100
        }
        this.betResult = parseFloat((this.betEth * betInfo.teamOdd).toFixed(4))
      }else{
        this.betResult = 0;
      }
    },

    clearEth() {// 배팅액의 x를 누르면 바로 화면에 동기화 되도록
      this.betEth = '';
      this.betResult = 0;
    },

    // checkComment() {
    //   //textarea에서 키를 입력할 때마다 동작 - 글자수 제한
    //   const limitTxtLen = 5;
    //   if (this.textareaTxt.length > limitTxtLen) {
    //     console.log('글자수 초과');
    //     this.textareaTxt = this.textareaTxt.slice(0, limitTxtLen);
    //     this.isExcessTxtLen = true;
    //   } else { this.isExcessTxtLen = false; }
    // },

    // user이름과 avatar 정보 만들기. mixin으로 이동
    // // 답글의 답글 저장하기, 부모 idx, 자식 replyId
    // async postReply2(idx, reIdx, replyId, mainCommentId, toNickname){
    // },
    // 답글 저장하기. 모든 답글은 배열안에 들어간다. 따라서 고유의 uid를 가지고 있어야 한다. idx에는 답글의 배열 index가 들어있다.
    // async postReply(idx, mainCommentId, toNickname, event){
    // },

    // async postComment(category) { // 1은 게임게시판
    // },
    _getGameStat(){
      const gameStat = new Array();
      const betInfo = this.betHistory;
      betInfo.map( stat =>{
        const index = gameStat.findIndex( el => el.selectedTeam == stat.selectedTeam );
        if ( index != -1 ) {
          gameStat[index].count++;
          // float연산은 소수점 연산에서 정확하지 않다. 따라서 정수로 만든 후 나중에 실수로 바꾼다.
          gameStat[index].stake += parseInt(stat.stake * 1000);
        } else {
          gameStat.push({
            // sorting       : sorting,
            selectedTeam  : stat.selectedTeam,
            bet           : stat.teamName,
            count         : 1,
            stake         : parseInt(stat.stake * 1000 ),
          });
        }
      });
      // 아래와 같이 다시 1000을 나눠 실수형으로 바꿔준다.
      // https://www.w3schools.com/jsref/jsref_reduce.asp 아래와 같이 sum을 구한다.
      gameStat.map( ( stat, idx )=> gameStat[idx].stake = stat.stake / 1000 );
      const betSum = gameStat.reduce( (prev, next)=> prev + next.stake, 0 );
      this.betHeaders[1].text = `Count (${this.betHistory.length})`;
      this.betHeaders[2].text = `Stake (${ parseInt(betSum*1000)/1000} Eth)`;
      return gameStat.sort( (a,b)=> a.selectedTeam - b.selectedTeam );
    },
    // 게임상태 알아내기
    _changeGameStatus (gameInfo){
    // 2:pending, 3:open, 4:playing, 5:returned, 8: 10 mins before play, 9: waiting to open, 10:disuse, 11: 경기종료. 보상 대기중
      // 만약 pending 상태라면(db에 게임 정보만 있어도 pending상태가 된다)
      if (gameInfo.open_status == 2 ) {
        this.gameStatus = 'Pending game. Please wait to open this game.';
        this.betMask = htmlEl[6].tag;
      } else if (gameInfo.open_status == 10) { // 만약 disuse 라면
        this.gameStatusId = 10;
        this.gameStatus = 'Not an available game.';
        this.betMask = htmlEl[11].tag;
      }
      else if (gameInfo.open_status == 3 ){ // open상태인데
        this.gameStatus = 'Betting...';
      }

      const now          = Date.now();
      const eventTime    = gameInfo.event_timestamp * 1000;
      const startTime    = eventTime; // 경기 시작
      const betCloseTime = eventTime - (1000 * 60 * 10); // 경기 10분 전 베팅을 닫는다.
      const returnTime   = eventTime + (1000 * 60 * 60 * 2); // 경기 2시간 30분 후 게임결과 가져오기.
      const closeTime    = eventTime + (1000 * 60 * 60 * 3); // 보상 완료 후 완전 종료.
      if (betCloseTime <= now && startTime > now ){ // 경기 10분전
      // console.log(1);
        this.gameStatusId = 8;
        this.gameStatus = '10 minutes before match start. Betting closed.';
        this.betMask = htmlEl[7].tag;
      } else if (startTime <= now && returnTime > now) { // 경기 중
      // console.log(2);
        this.gameStatusId = 4;
        this.gameStatus = 'In-Play!';
        this.betMask = htmlEl[8].tag;
      } else if (returnTime <= now && closeTime > now ) { // 경기 종료. 보상 대기중
      // console.log(3);
        this.gameStatusId = 6;
        this.gameStatus = 'Payouts will be made within about 30 minutes after the match finish.';
        this.betMask = htmlEl[9].tag;
      }
      if ( gameInfo.open_status == 5){ // 보상완료
      // console.log(4);
        this.gameStatus = 'Winnings were paid completely. Match closed.';
        this.gameStatusId = 5;
        this.betMask = htmlEl[10].tag;
      }

    },
    // Score에 맞춰 게임 결과 표시
    _calGameResult(gameInfo) {
      const gameResult = new Object();
      // if (gameInfo.goalsHomeTeam != undefined){
      if (gameInfo.status != 'Not Started' && gameInfo.status != 'Time to be defined' && gameInfo.status != 'Match Postponed'){
        if (gameInfo.goalsHomeTeam > gameInfo.goalsAwayTeam) {
          gameResult.fullTime = 1; // homeTeam이 이겼다면 1
        } else if (gameInfo.goalsHomeTeam == gameInfo.goalsAwayTeam) {
          gameResult.fullTime = 2; // 비겼다면 2
        } else if (gameInfo.goalsHomeTeam < gameInfo.goalsAwayTeam) {
          gameResult.fullTime = 3; // awayTeam이 이겼다면 3
        }
        if ( (gameInfo.goalsHomeTeam + gameInfo.goalsAwayTeam) >= 3 ){
          gameResult.overUnder = 1;
        } else {
          gameResult.overUnder = 2;
        }
        this.gameResult = gameResult;
      }
    },
    async _allHistoryFuc(fixtureId){
      this.loader.gameBetInfo = true;
      const allHistory = await GameAPI.getBetHistory(fixtureId); // bet history
      this.allHistory = allHistory;
      // console.log(allHistory);
      allHistory.map( (info, idx)=>{
        allHistory[idx].number = allHistory.length - idx;
        allHistory[idx].createdAt_moment = this.$moment(info.createdAt).fromNow();
      })

      this.betHistory = allHistory;
      // console.log(allHistory);
      this.betInfoGames = this._getGameStat(); // game statistics
      this.loader.gameBetInfo = false;
    },

    // web3를 넣자
    async _web3Exe(){
      const contractInfo = await Contract.getContractInfo(); // contract 정보 가져오기
      this.contractInfo = contractInfo;
      // const wbContract = await new web3js.eth.Contract(contractInfo.abi, contractInfo.address);

      let web3js;
      if (this.isWeb3){ // 브라우저에 메타마스크(혹은 미스트)가 있는지 확인
        web3js = new Web3(web3.currentProvider); // 있다면 메타마스크를 쓰자.
      }
      this.web3js = web3js;
      try{
        const wbContract = await new web3js.eth.Contract(contractInfo.abi, contractInfo.address);
        this.wbContract = wbContract;
      } catch(err){ 
        // console.log('There is no web.');
      }
    },


    // Youtube 경기 영상 가져오기
    async _fetchYoutubeMatch(gameInfo){
      // const media = await GameAPI.youtubeMatch(mediaQuery); // 영상 정보
      gameInfo.media.youtube.map( el => {
        el.moment = this.$moment(el.publishedAt).fromNow();
        el.shortTitle = el.title.slice(0,50);
        el.embeded = `<iframe width="100%" height="auto" src="https://www.youtube.com/embed/${el.id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      });
      this.media.youtube = gameInfo.media.youtube;
    },

    // media 가져오기
    async _fetchGuardian(gameInfo){
      try{
        const mediaKey = '42e1834d-00e3-4f96-ab0c-7cd3bbb31b71';//가디언키
        const mediaQuery = `https://content.guardianapis.com/search?page-size=3&q=${gameInfo.homeTeam}%20${gameInfo.awayTeam}&api-key=${mediaKey}`;

        const media = await GameAPI.guardianInfo(mediaQuery); // 기사 3개
        // media.response.results.splice(3);l
        media.response.results.map( el => el.moment = this.$moment(el.webPublicationDate).fromNow());
        this.media.guardian = media.response.results;
        // console.log(this.media.guardian);
      }catch(err){ console.log(err);}
    },
    // game stat 및 prediction
    async _fetchStat(gameInfo, fixtureId){
      // console.log('fetchStat!');
      try{
        const statInfo = await GameAPI.getStatInfo(gameInfo.league_id, gameInfo.homeTeam_id, gameInfo.awayTeam_id, fixtureId); // 게임 정보

        if(statInfo){
          const homeStatInfo = statInfo[0] || new Object();
          const awayStatInfo = statInfo[1] || new Object();
          if(homeStatInfo.forme){// 랭킹이 없는 리그가 있다
            homeStatInfo.formeArr = homeStatInfo.forme.split('');
            awayStatInfo.formeArr = awayStatInfo.forme.split('');
          } else{
            homeStatInfo.formeArr = '';
            awayStatInfo.formeArr = '';
          }

          if(gameInfo.stat.home){
            homeStatInfo.goals_avg = gameInfo.stat.home.goals_avg;// 이렇게 따로 넣어야 에러가 안뜬다
            homeStatInfo.goals_against_avg = gameInfo.stat.home.goals_against_avg;
            awayStatInfo.goals_avg = gameInfo.stat.away.goals_avg;
            awayStatInfo.goals_against_avg = gameInfo.stat.away.goals_against_avg;
            gameInfo.stat.h2h.map( (game)=>{
              game.moment_time = this.$moment(game.event_timestamp*1000).fromNow();
              game.leagueShortName = Util.getLeagueName(game.league_name);
            })
            homeStatInfo.h2h = gameInfo.stat.h2h; // 따로 h2h를 만들지 않고 그냥 homeStatInfo안에 넣었다.
          }

          this.homeStatInfo = homeStatInfo;
          this.awayStatInfo = awayStatInfo;
          // console.log(this.homeStatInfo.h2h);
        }
      } catch (err) {
        console.log(err);
      }

    },
    async _getComments(fixtureId, where=1){
      // console.log('코멘트 가져오기');
      if(where==2){// refresh를 눌렀을때만 로딩바가 나오도록
        this.changeLoadingStatus(true);
      }
      const comments = await GameAPI.getComments(fixtureId, 1);
      comments.sort( (a,b)=> (a.notice==b.notice) ? 0: a.notice ? -1 : 1 );           
      let commentsCount = comments.length;
      // console.log(comments);

      comments.map( comment =>{
        const avatarInfo = this.getAvatarInfo(comment.user, comment.avatar_num);
        comment.nickname = avatarInfo.nickname;
        comment.avatar   = avatarInfo.avatar;
        comment.moment   = this.$moment(comment.createdAt).fromNow();
        comment.score.upLoader = false;
        comment.score.downLoader = false;
        comment.isWritingReply = false;
        comment.replyText = '';
        commentsCount += comment.sub_comment_arr.length;
        comment.sub_comment_arr.map( reply => {
          const avatarInfo = this.getAvatarInfo(reply.user, reply.avatar_num);
          reply.nickname = avatarInfo.nickname;
          reply.avatar   = avatarInfo.avatar;
          reply.moment   = this.$moment(reply.createdAt).fromNow();
          reply.score.upLoader = false;
          reply.score.downLoader = false;
          reply.isWritingReply = false;
          reply.replyText = '';
        })
        // comment.score.total = comment.score.good.length - comment.score.bad.length;
      })

      // 공지 코멘트
      const notice = {
        user           : "",
        avatar         : "https://whitebetting.s3-us-west-1.amazonaws.com/game/avatar/13.png",
        nickname       : "Messi",
        avatarNum      : 13,
        _id            : "",
        category       : 1,
        moment         : "a few seconds ago",
        article        : "How do you think about this match?",
        score          : { good : [], upLoader:false, bad: [], downLoader: false, },
        isWritingReply : false,
        replyText      : "",
      }
      comments.unshift(notice);

      this.commentsCount = commentsCount;
      this.comments = comments;
      if(where==2){
        this.changeLoadingStatus(false);
      }
      // console.log(comments);

    },
    async _fetchData(fixtureId){
      try{
        this.changeLoadingStatus(true);
        const gameInfo = await GameAPI.getGameInfo(fixtureId); // 게임 정보
        // if(!gameInfo) this.$router.push('/'); // 나중에 해당 게임이 없을 때 보여줄 페이지

        this._calGameResult(gameInfo); // 게임 결과 표시
        this._changeGameStatus(gameInfo); // 게임상태 정보 가져오기

        const now          = Date.now();
        const eventTime    = gameInfo.event_timestamp * 1000;
        const startTime    = eventTime; // 경기 시작
        const after10min   = eventTime + (1000 * 60 * 10 );
        if (startTime <= now && after10min > now) { // 경기 시작 후 10분 동안
          gameInfo.status = 'First Half'; // 5분마다 한번씩 게임정보를 가져오기 때문에 처음 5분동안 Not Started로 찍힌다. 이걸 막기위해 처음 10분간 정보는 하드코딩한다.
        }
        gameInfo.event_date_local = this.$moment(gameInfo.event_date).format('llll');
        gameInfo.event_date_mlocal = this.$moment(gameInfo.event_date).fromNow();

        this.gameInfo = gameInfo;
        // console.log(this.gameInfo);
        this.changeLoadingStatus(false);//주요 게임정보를 받은 후에는 바로 로딩바를 없앤다

        // twitter 처리
        let twitterText;
        if (gameInfo.odd) {
          twitterText = `The way I love football, WhiteBetting! \n ${gameInfo.homeTeam}(${gameInfo.odd.homeTeam}) VS(draw ${gameInfo.odd.drawTeam}) ${gameInfo.awayTeam}(${gameInfo.odd.awayTeam}) \n`;
        } else {
          twitterText= `The way I love football, WhiteBetting! \n ${gameInfo.homeTeam} VS ${gameInfo.awayTeam} \n`;
        }
        const twitter = `https://twitter.com/intent/tweet?url=${window.location.href}&via=BettingWhite&text=${escape(twitterText)}&utm_campaign=sns_share&utm_source=twitter&utm_medium=timeline`;
        this.sns.twitter = twitter;
        // facebook 처리 (페북의 문구입력은 openGraph로 하기 때문에 어쩔수 없이 social-sharing을 모듈을 사용했다 19.12.10)
        const fb_href = `https://whitebetting.com/football/${fixtureId}?utm_campaign=sns_share&utm_source=facebook&utm_medium=timeline`;

        this.sns.facebook.href = fb_href;
        this.sns.facebook.title = twitterText;
        this.sns.facebook.description = twitterText;

        // telegram 처리
        const telegramText = `https://telegram.me/share/url?url=${window.location.href}&text=${twitterText}&utm_campaign=sns_share&utm_source=telegram&utm_medium=timeline`
        this.sns.telegram = telegramText;
        if(gameInfo.league){
          this.league = { name : gameInfo.league.name , country: gameInfo.league.country};// object의 경우 이렇게 빼서 따로 넣어줘야 error가 안난다. 현재 vue의 한계인것 같다.
        }
        // 같은 리그일때는 리그id만 줘도 되지만 챔피언스나 유로파의 경우 듣보잡팀도 있고 국가별 대항전의 경우도 있다. 이 경우 어떻게 보여주는게 좋을지 고민해보자. 네이버를 보면 리그만 게임정보를 보여준다.=> 그냥 해당 리그의 id를 주는게 좋겠다.
        this._fetchStat(gameInfo, fixtureId);// 게임 스탯 가져오기
        this._fetchGuardian(gameInfo);// 게임 기사 가져오기. 가디언
        this._fetchYoutubeMatch(gameInfo);// 게임 영상 가져오기. 유튜브
      } catch (err) {
        // console.log(err);
      }
    },
    async _getUserWhite(){
      // 유저의 white가져오기
      try{
        let white;
        if(this.userAccount){
          const myWhite = await GameAPI.getUserWhite(this.userAccount); // 유저 정보에 따른
          white =  (myWhite) ? myWhite : 0;
        } else white = 0;

        this.vuexWhite(white);
      } catch(err){
        console.log(err);
      }
    },

    // async deleteReply(idx, reIdx, replyId){//idx는 덧글의 인덱스, reIdx는 답글의 인덱스
    // },// mixin으로 뺌
    // async deleteComment(idx){
    // },
    // // 답글 글쓰기 창 열기. 오직 하나만 열리게 한다.
    // replyComment2(idx, reIdx){// 부모 idx와 자식 reIdx
    // },
    // replyComment(idx){
    // },
    // async replyVote(what, idx, reIdx, replyId){//  mixin으로 뺌
    // },
    // async commentVote(what, idx){ //  mixin으로 뺌
    // },
    checkEdge(){
      if (navigator.userAgent.indexOf('Edge') >= 0){
          console.log('Edge!');
          this.homeStatInfo = '';
        }
    },
    apiFootballImg(e, teamId){
      e.target.src =`https://www.api-football.com/public/teams/${teamId}.png`;
      return;
    },
  },

  computed : {
    computedHeaders () {
      return this.headers.filter(h => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },

		...mapState([ // state는 computed에 넣는다
			'isWeb3', 'userAccount', 'myETH', 'white', 'isWalletLogin', 'isShowWallet', 'loadingStatus',
    ]),
  },
  watch : {
    hashTx(val) { // 좋아. 여기서 hashTx를 받아온다. 이제 여기서 val을 이용해 화면을 바꾸고 해결하자. 죽을 고생했다.
      this.cancelWindow = false;
      this.betMask = htmlEl[3].tag.replace('###', val);
    },

  },
  async created(){
    this.deleteHelloDom();    
    Util.checkSession(this.$session, this.userAccount); // session 체크
    window.scrollTo(0,0); // 항상 페이지 최상단으로
    this._web3Exe();
    this.isCC = isCC;// 유튜브 모바일 타이틀 길이 때문에
    const fixtureId = +this.$route.params.fixtureId;
    const dataMatchNum = 1000000000 + fixtureId;
    const dataMatch = `e_match_${dataMatchNum}`
    // gtag('e_football_page', '축구대회_화면', {
    //   'e_football_id_page`' : `축구 ${dataMatchNum} 화면`,
    // });
    
    this.dataAnalysis(dataMatchNum );//특정 경기 page진입

    // 게임정보 처리. 배당률 변경시 한번더 사용하기에 모듈화함.
    this._fetchData(fixtureId);
    this._getUserWhite();// player white 가져오기
    this._allHistoryFuc(fixtureId); // 베팅 히스토리 가져오기

    this._getComments(fixtureId);// 코멘트 가져오기

    // this.checkEdge();// edge에서는 Match Statistics가 나오지 않아 그냥 disable한다.

    // 메타마스크 연결창 띄우기
    try{
      if(ethereum){
        await ethereum.enable();
      }
    } catch(err){ console.log('There is no any ethereum wallet');}
  },
  beforeCreate(){ // 세션처리는 Toolbar에서 한다
  },
}

</script>

<style >
button:active, button:hover, button:focus{outline:0px;}
.gamePage{overflow:hidden;}
/* .open{border-left:5px solid #64B5F6;} */
.open{border-left:5px solid #e0e0e0;}
.close{border-left:4px solid grey;}
.ready{border-left:4px solid greenyellow;}
.gameItem{max-width: 1263px;}
.gameCard{border-radius:3px;}
.gameListTxt{color:#C2185B;width: 200px;}
.scoreNotice{font-size:11px;}

.myEthInfo{color:#666;line-height:80px;}
.where{font-size:1em;}
.teamImgBox{height:100px;}
  /* white-space는 단어를 잘라 넘기기. word-break는 글자단위로 자르기 */
.teamNameTxt{color:grey;white-space: normal;}
.teamLogo{max-width:100px;max-height:100px;margin:0 auto;margin-top:5px;}
.teamLogoH2h{max-width:20px;max-height:20px;}
.drawBtn{color:#64B5F6;min-height:100px;}
.betOdd{color:green;font-size:1.4em;}
.scoreNum {font-size:2em;}
.gameBtn{border-radius:0px;width:100%;height: auto;min-height:100px; }
.gameBtn:hover,.gameBtn:active{ color:deeppink;}
/* .wonBetCell{background-color: #B2DFDB;border-radius:0px;} */
.underOverBtn{height:auto;min-height:70px;width:100%;color:rgba(0,0,0,0.87);}
.underOverBtn:hover,.underOverBtn:active{ color:deeppink;}
.toReturnTxt{line-height: 29px;margin-left:15px;}
.toReturnUnitTxt{line-height: 29px;margin-left:5px;}
.toReturnNum{line-height: 29px;margin-left:10px;color:#ffeb3b;}
.betEthTxt{font-size: 25px;;}
.placeBetTxt{font-size: 18px;text-transform: none;box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)!important;}
.myEthNum{color:#C2185B;}
.myWhiteNum{color:#3674BA; }
.myEthTxt{color:#444;}
.metamaskTxt{font-size:18px;color:#444;line-height:-10px;}
.trustWalletTxt{color:#3674BA;cursor:pointer;margin-right:10px;}
.walletImg{width:20px;border-radius:2px;margin-right:2px;margin-top:2px;}

/* .external_link{ text-decoration:normal;animation-duration: 1s;animation-name: shake;animation-iteration-count: 2;animation-timing-function: ease;font-size: 20px;} */
.external_link{ text-decoration:normal;font-size: 20px; color:#C2185B;animation: shake 1s 0.7s ease 2;}
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -1px) rotate(-1deg); }
  20% { transform: translate(-1px, 0px) rotate(1deg); }
  30% { transform: translate(1px, 1px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 1px) rotate(-1deg); }
  60% { transform: translate(-1px, 1px) rotate(0deg); }
  70% { transform: translate(1px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 1px) rotate(0deg); }
  100% { transform: translate(1px, -1px) rotate(-1deg); }
}

.v-btn:not(.v-btn--depressed):not(.v-btn--flat){box-shadow: 0px 0;-webkit-box-shadow:0px 0 ;}
/* .v-input__control{height:50px;background-color:blue;} */
.v-text-field__slot input{padding:5px;margin:0;}
/* .v-text-field__details{display:none;} */
.v-messages{display:none;}

/* 베팅 통계 */
/* .stat_borderBottomBold{border-bottom:1px solid #e1e1e1;}
.stat_borderBottom{border-bottom:1px solid #e1e1e1;}
.stat_borderRight{border-right:1px solid #e1e1e1;}
.stat_borderLeft{border-left:1px solid #e1e1e1;} */
.stat_bold{background:#e1e1e1;font-size:1.5em;}
.stat_TeamName {line-height:35px;height:35px;}
.stat_rank{line-height:25px;height:25px;}
.stat_vs{color:grey;font-size:0.8em;}
.stat_grey{color:#555;}
.stat_youtube{overflow:hidden;height:70px;width:auto;}

.last5Icon {padding:1px 6px 0;border-radius:12px;line-height:14px;font-size:14px;text-decoration:none;box-shadow:inset 1px 1px 1px rgba(255,255,255,0.08);vertical-align:middle; margin-left:5px;}

.loseIcon{border:1px solid #EF5350;color:#EF5350;}
.winIcon{border:1px solid #42A5F5;color:#42A5F5;}
.drawIcon{border:1px solid grey;color:grey;}
.lastIcon{font-size:18px;}
.lastAwayIcon{margin-left:0;}


/* 베팅 히스토리 */
.theme--light.v-table{background-color:#FAFAFA;}
.theme--light.v-datatable .v-datatable__actions{background-color:#FAFAFA;}
.betHistoryTxt{color:#555;font-weight:bold;line-height:15px;}
/* Game statistics 의 페이징을 보이게 할지 결정*/
/* .gameBetInfo .v-datatable__actions__range-controls{display:none;} */
/* 아래의 경의 serve와 build 버전이 다르게 나와 .v-datatable__actions>를 적용하니 제대로 보여진다ㅜ */
.v-datatable__actions>.v-datatable__actions__select{display:none;}
/* .gameBetInfo .v-datatable__actions{display:none;} */

.betHistoryNum{max-width: 50px;;overflow:hidden;}
.betHistoryUser{max-width: 100px;overflow:hidden;}
.betHistoryBet{min-width: 120px;overflow:hidden;}
.betHistoryGame{max-width: 150px;overflow:hidden;}
.betHistoryReturns{min-width:120px;;overflow:hidden;}

.betExpandDesc{padding-left:24px;padding-top:0px;padding-bottom:10px; overflow:hidden;font-weight:bold;}
.betExpandValue{padding-left:54px;padding-top:0px;padding-bottom:10px; overflow:hidden}

.betExpandFirst{margin-top:10px;}
.betExpandLast{margin-bottom:0px;}
.expandedList{background-color:#eee;}


/* Comments */
.commentTxt{color:grey;margin-top:-10px;}
.commentNickname{font-size:1.1em;line-height:40px;max-width:120px;overflow:hidden; white-space: nowrap;}
.commentAvatar{margin-right:20px;width:40px;height:40px;border-radius:30px;overflow:hidden;}
.commentAvatarSize{transform:scale(1.5);width:40px;height:40px;border-radius:30px;overflow:hidden;}

.commentPostBtn{box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)!important; margin-top:-5px;margin-bottom:12px;}
.commentBtn{opacity:0.5;}
.theme--light.v-input:not(.v-input--is-disabled) input, .theme--light.v-input:not(.v-input--is-disabled) textarea {
  padding-left:5px;color:#0D47A1;
}
.replyArea{background-color: #f1f1f1;padding-left:5px;}


/* .theme--light.v-list {
  background: #fafafa;
  color: rgba(0,0,0,0.87);
} */


/* popUp 연출 */
.title{white-space: normal;}
.closeBetBtn{position: absolute; right:0px;top:0px;}
.closePopupBtn{opacity:0.7;}

.pcPopBet{max-width: 700px;min-width:320px;}
.kindOfGame{font-size:1.1em;}
.fade-enter-active, .fade-leave-active {  transition: opacity 2s;}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {  opacity: 0;}
.iCodeLink{transform: rotate(180deg);}
.extraInfo{font-size:11px;color:rgb(212, 212, 132);}
.quickBetBtn{color:#fff;line-height:23px; width:60px;height:30px;display:inline-block;background-color:#0D47A1;border:1px solid white;margin: 3px 5px;padding:2px;cursor:pointer;box-shadow:0 1px 2px rgba(100,100,100,.5),0 1px 2px rgba(100,100,100,.58);;border-radius:14px; }
a.quickBetBtn:hover, a.quickBetBtn:focus {color:yellow;border:1px solid yellow;box-shadow:none;text-decoration: none;}
.v-text-field__slot input {padding-left: 10px;margin: 0;}
/* .quickBetAddBtn{margin-top:17px;padding:3px;border:1px solid white;border-radius:14px;} */
.quickBetAddBtn{margin-top:17px;padding:3px;border-radius:15px;display:block;}

.VueCarousel-dot-container{margin-top:0px !important;}
.VueCarousel-dot{margin-top:5px !important;}
/* placeBet()후 베팅창 mask */
.inPlay { padding: 5px 5px;  position: absolute;  z-index: 1;  left: 0;  top: 0;  width: 100%;  height: 100%;  box-sizing: border-box;  background-color:rgba(20, 73, 160, 0.9);}
.coinIcon{display:block;margin:0 auto;}
.guaranteeImg{top:55px;right:10px;float:right;width: 120px;z-index:-5;position:absolute; animation:showGuarantee 0.7s;}
@keyframes showGuarantee{
  0%  {opacity:0.1;width:220px;}
  80% {opacity:0.8;width:110px;}
  90% {opacity:0.8;width:125px;}
  100% {opacity:0.8;width:120px;}
}
/* Betting History Padding 제거 */
table.v-table thead td:not(:nth-child(1)), table.v-table tbody td:not(:nth-child(1)), table.v-table thead th:not(:nth-child(1)), table.v-table tbody th:not(:nth-child(1)), table.v-table thead td:first-child, table.v-table tbody td:first-child, table.v-table thead th:first-child, table.v-table tbody th:first-child {  padding: 0 8px;}

button{border-width:0px !important;}

@media screen and (min-width:0px) and (max-width: 960px){
  .open{border-left:2px solid #e0e0e0;}
  .close{border-left:2px solid grey;}
  .ready{border-left:2px solid greenyellow;}
  .where{color:grey;}
  .scoreNotice{margin-top:0px;text-align:right;}
  /* white-space는 단어를 잘라 넘기기. word-break는 글자단위로 자르기 */
  .teamNameTxt{ overflow: hidden;word-break:break-all;}
  .mediaTxt{ white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width:260px;}

  .stat_TeamName {overflow: hidden;word-break:break-all;}

  .betHistoryNum{max-width: 20px;}
  .betHistoryUser{max-width: 44px;}
  .betHistoryBet{max-width:80px;}
  .betHistoryReturns{min-width:50px;}

  .betExpandDesc{width: 100%;padding:0;}
  .betExpandValue{width: 100%;padding:0;padding-left:5px;}
  .betExpandLast{margin-bottom:5px;}
  /* 이유는 모르겠으나 아래와 같이 해야만 transaction 모양이 제대로 나온다 */
  /* .betExpandTransaction{width: 50px;display:block;} */

.last5Icon {padding:1px 3px 0;border-radius:10px;line-height:14px;font-size:12px;text-decoration:none;box-shadow:inset 1px 1px 1px rgba(255,255,255,0.08);vertical-align:middle; margin-left:5px;}
.lastIcon{font-size:16px;}
.lastAwayIcon{margin-left:0;}

table.v-table thead td:not(:nth-child(1)), table.v-table tbody td:not(:nth-child(1)), table.v-table thead th:not(:nth-child(1)), table.v-table tbody th:not(:nth-child(1)), table.v-table thead td:first-child, table.v-table tbody td:first-child, table.v-table thead th:first-child, table.v-table tbody th:first-child {  padding: 0 2px;}
}
</style>
