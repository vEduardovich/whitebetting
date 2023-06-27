<template>
  <div class='userPage'>
    <v-layout>
      <v-flex xs12 lg12>
      <h3 class="mt-4 mb-2 accountTxt " v-bind:class="{'mt-4 ml-4': $vuetify.breakpoint.mdAndUp}"  >
        <v-icon class='accountIcon' >account_circle</v-icon>
        <span>&nbsp;{{ thisUser }}</span>
      </h3>
      </v-flex>
    </v-layout>
    <v-layout wrap column>
      <v-flex xs12 lg8 v-show='helloOwner'>
        <h4 class="ml-2 ownerTxt"><span class='ownerTxtSecond' v-bind:class="{'owenrTxtFirst': $vuetify.breakpoint.mdAndUp}" >Don't be surprised the stake is big.</span><span class='ml-2 ownerTxtSecond'>This is the Owner Account.</span></h4>
      </v-flex>
      <v-flex xs12 lg8>
      <h3 class="ml-1 accountTxt">
        <span class='userWhite' >White Token [ </span>
        <span class="myWhiteNum">{{userWhite}} W </span>
        <span class='userWhite mr-1' >]</span>
        <v-tooltip bottom :open-delay=0>
          <template v-slot:activator="{ on }" >
            <v-icon v-on="on" class='dollarIcon'>monetization_on</v-icon>
          </template>
          <span>You can exchange 100 WhiteToken for 1ETH.<br/>Please request via telegram.<br/>[We will apply the automatic exchange system later]</span>
        </v-tooltip>
      </h3>
      </v-flex>
    </v-layout>

    <v-layout column wrap >
      <v-flex xs12 lg8>
        <div class='grey--text mb-1 gameCard open' v-bind:class="[{'ml-4': $vuetify.breakpoint.lgAndUp }, {'mb-2': $vuetify.breakpoint.lgAndUp } ]"  outline >
        </div>

      </v-flex>

      <!-- 유저 베팅 history -->
      <div class='mt-3 mb-2' style='max-width:100%;' v-bind:class="{'mt-4 ml-4': $vuetify.breakpoint.mdAndUp}">
        <v-layout align-end justify-space-between  >
          <div>
            <h3 class="betHistoryTxt ml-1"  >
              <v-icon style='line-height:15px;font-size:18px;' class='fas fa-book-open' ></v-icon>
              Betting History
            </h3>
          </div>
        </v-layout>

        <v-data-table
          class='userHistory '
          v-bind:class="{'mt-3': $vuetify.breakpoint.mdAndUp}"
          v-bind:headers="computedHeaders"
          v-bind:expand="expand"
          v-bind:items="userBetInfo"
          v-bind:search="search"
          v-bind:loading="loader.userBetInfo"
          hide-actions
          item-key="transaction"
          v-bind:pagination.sync="pagination"
          disable-initial-sort
        >
          <template slot="items" slot-scope="props" >
            <tr v-on:click="props.expanded = !props.expanded" >
              <td  class='searchedNumber text-xs-center' style='max-width: 40px;'>
                {{ (pagination.page-1) * pagination.rowsPerPage + (props.index + 1) }}
              </td>

              <td style='min-width:50px;padding:0px;' v-if="!$vuetify.breakpoint.xs">{{ props.item.createdAt_moment }}</td>
              <td style='min-width:80px;padding:0px;' v-if="!$vuetify.breakpoint.xs">{{ props.item.event_date_moment }}</td>
              <td style='min-width:130px;padding:0px;' v-if="!$vuetify.breakpoint.xs">{{ props.item.game }}</td>
              <td style='min-width:100px;padding:0px;'>{{ props.item.teamName }}</td>
              <td style='padding:0px;' >{{ props.item.stake }}</td>
              <td  v-if="!$vuetify.breakpoint.xs">{{ props.item.odd }}</td>
              <td  v-if="!$vuetify.breakpoint.mdAndDown">{{ props.item.market }}</td>
              <td style=''>{{ props.item.returnEth }}</td>
            </tr>
          </template>

          <template slot="expand" slot-scope="props" >
            <!-- 테이블로 만들었더니 모바일 레이아웃을 도저히 설정할 수 없어 아래와 같이 만든다 -->
            <v-layout row v-if='props.item.createdAt_moment'  class='expandedList' >
              <v-flex xs2>
                <div class='betExpandDesc betExpandFirst'>Created</div>
              </v-flex>
              <v-flex xs10>
                <div class='betExpandValue betExpandFirst' >{{props.item.createdAt_moment}}</div>
              </v-flex>
            </v-layout>

            <v-layout row  v-if='props.item.event_date' class='expandedList'>
              <v-flex xs2>
                <div class='betExpandDesc'>Start Time</div>
              </v-flex>
              <v-flex xs10>
                <div class='betExpandValue' >{{props.item.event_date}}</div>
              </v-flex>
            </v-layout>

            <v-layout row  v-if='props.item.leagueName' class='expandedList'>
              <v-flex xs2>
                <div class='betExpandDesc'>League</div>
              </v-flex>
              <v-flex xs10>
                <div class='betExpandValue' >{{props.item.leagueName}}</div>
              </v-flex>
            </v-layout>

            <v-layout row  v-if='props.item.game' class='expandedList'>
              <v-flex xs2>
                <div class='betExpandDesc'>Match</div>
              </v-flex>
              <v-flex xs10>
                <div class='betExpandValue' >
                  <router-link v-bind:to="'/football/'+ props.item.fixture_id"  class='betExpandTransaction' v-on:click.native='dataAnalysis(4301)'>
                    {{props.item.game}}
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
                <div class='betExpandDesc'>Market</div>
              </v-flex>
              <v-flex xs10>
                <div class='betExpandValue' >{{props.item.market}}</div>
              </v-flex>
            </v-layout>

            <v-layout row  v-if='props.item.fixture_Obj_id.status' class='expandedList'>
              <v-flex xs2>
                <div class='betExpandDesc'>Status</div>
              </v-flex>
              <v-flex xs10>
                <div class='betExpandValue' >{{props.item.fixture_Obj_id.status}}</div>
              </v-flex>
            </v-layout>

            <v-layout row v-if='props.item.returnEth' class='expandedList'>
              <v-flex xs2>
                <div class='betExpandDesc'>Return</div>
              </v-flex>
              <v-flex xs10>
                <div class='betExpandValue' >{{props.item.returnEth}}</div>
              </v-flex>
            </v-layout>

            <v-layout row v-if='props.item.transaction'  class='expandedList'>
              <v-flex xs2>
                <div class='betExpandDesc betExpandLast'>Txhash</div>
              </v-flex>
              <v-flex xs10>
                <div class='betExpandValue betExpandLast' >
                  <a v-bind:href="'https://etherscan.io/tx/'+ props.item.transaction" target='_blank' class='betExpandTransaction' v-on:click='dataAnalysis(4302)'>
                    {{props.item.transaction}}
                  </a>
                </div>
              </v-flex>
            </v-layout>

          </template>
        </v-data-table>

        <div class="text-xs-center pt-2 ">
          <v-pagination :total-visible="5" v-model="pagination.page" :length="pages" color='blue lighten-2'></v-pagination>
        </div>

      </div>
      <!-- 베팅 history 끝 -->
    </v-layout>

		<!-- adding loading icon -->
		<Loading v-if='loadingStatus'/>
  </div>
</template>

<script>
import GameData from '@/commons/gameData';
import gameAPI from '@/commons/gameAPI'
const GameAPI = new gameAPI();
import util from '@/commons/util';
const Util    = new util();
import { mapState, mapActions, mapMutations } from 'vuex'
import Loading from '@/components/Loading'
import mixinDataAnal from '@/commons/mixinDataAnal';

export default{
  name : 'User',
  components: { Loading },
  mixins: [mixinDataAnal],
  data() {
    return {
      expand      : false,
      userBetInfo : [],
      thisUser : '',
      userWhite : '',
      helloOwner : false,

      search: '',
      pagination: {
        rowsPerPage : 10,
      },
      selected: [],
      headers: GameData.betHeaders,
      loader :{ userBetInfo : false, },
    }
  },
  methods: {
		...mapActions([ // store.js에 있는 changeLoadingStatus함수로 CHANGE_LOADING_STATUS를 바꾸면 loadingStatus가 바뀐다.
			'changeLoadingStatus',
		]),
    ...mapMutations ([
      'CHANGE_LOADING_STATUS', // 로딩화면 추가
    ]),
    _isOwner(gotUserAccount){
      const userList = [
        "0x0F5EBe4525e54EBCdEA606e825C444910662fa18",
      ];
      // Owner 계정에서 결제한거라면
      const isMe = userList.findIndex( user => user == gotUserAccount);
      if(isMe != -1) this.helloOwner = true;
    }
  },
  async created(){
    this.dataAnalysis(20003);
    this.deleteHelloDom();    
    Util.checkSession(this.$session, this.userAccount); // session 체크
    window.scrollTo(0,0); // 항상 페이지 최상단으로

    const gotUserAccount = this.$route.params.userAccount;
    this.thisUser = gotUserAccount;
    if (gotUserAccount){
      try{
        this.loader.userBetInfo = true;
        this.changeLoadingStatus(true);
        const userBetInfo = await GameAPI.getUserBetInfo(gotUserAccount);
        const userWhite   = await GameAPI.getUserWhite(gotUserAccount);

        // white가 있다면 보여주고 아니라면 0을 보여준다
        this.userWhite = (userWhite) ? userWhite : 0 ;
        // owenr계정이면 따로 표시한다.
        this._isOwner(gotUserAccount);
        userBetInfo.map( (info, idx)=>{
          userBetInfo[idx].number = userBetInfo.length - idx ;
          userBetInfo[idx].createdAt_moment = this.$moment(info.createdAt).fromNow();
          // console.log(info.fixture_Obj_id);
          // console.log(info.fixture_id);
          // console.log(idx);
          if(info.fixture_Obj_id){
            userBetInfo[idx].game = `${info.fixture_Obj_id.homeTeam} : ${info.fixture_Obj_id.awayTeam}`;
            if(info.fixture_Obj_id.league){
              userBetInfo[idx].leagueName = info.fixture_Obj_id.league.name;
            } else{
              userBetInfo[idx].leagueName = info.fixture_Obj_id.round;
            }
            userBetInfo[idx].event_date_moment = this.$moment(info.fixture_Obj_id.event_date).format('ll');
            userBetInfo[idx].event_date = this.$moment(info.fixture_Obj_id.event_date).format('llll');
          } else{
            userBetInfo[idx].game= '';
            userBetInfo[idx].event_date_moment ='';
            userBetInfo[idx].event_date ='';
          }
          // returnEth 계산
          if (info.returnEth == undefined ) userBetInfo[idx].returnEth = 'Not yet';
          else if (info.returnEth == -1) userBetInfo[idx].returnEth = 'Refunded';
          else userBetInfo[idx].returnEth = info.returnEth;
        })
        this.userBetInfo = userBetInfo;
        this.changeLoadingStatus(false);
        this.loader.userBetInfo = false;
      } catch(err) { console.log(err);
      }
    }
  },
  computed : {
    computedHeaders () {
      return this.headers.filter(h => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
    pages () {
      this.pagination.totalItems = this.userBetInfo.length;
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    },
		...mapState([ // state는 computed에 넣는다
			'isWeb3', 'userAccount', 'loadingStatus',
		]),
  },
  beforeCreate(){ // 세션처리는 Toolbar에서 한다
  },
}

</script>
<style scoped>
/* word-break:break-all;은 영문 글자단위로 쪼개기 */
.userHistory{max-width: 1263px;word-break:break-all;cursor:pointer;background-color:#fff !important;}
.userWhite{color:#C2185B;}
.accountTxt{color:#888;width: 800px;font-size: 25px;}
/* .dollarIcon{font-size:1.3em; color:#C2185B;animation-duration: 2s;animation-name: shake;animation-iteration-count: 2;animation-timing-function: ease;} */
.dollarIcon{font-size:1.3em; color:#C2185B;animation: shake 2s 0.7s ease 2;}
@keyframes shake {
  0%   { transform: scale(1,1)      translateY(0); }
  10%  { transform: scale(1.1,.9)   translateY(0); }
  30%  { transform: scale(.9,1.1)   translateY(-10px); }
  50%  { transform: scale(1.05,.95) translateY(0); }
  57%  { transform: scale(1,1)      translateY(-2px); }
  64%  { transform: scale(1,1)      translateY(0); }
  100% { transform: scale(1,1)      translateY(0); }
}

.ownerTxt{color:#999;font-size: 20px;text-align:left;}
.owenrTxtFirst{margin-left:150px;}
.ownerTxtSecond{display:inline-block;}
.accountIcon{font-size:34px;}
.iCodeLink{transform: rotate(180deg);}
.myWhiteNum{color:#3674BA; }
.betExpandDesc{padding-left:50px;padding-top:0px;padding-bottom:10px; overflow:hidden;font-weight:bold;}
.betExpandValue{padding-left:0px;padding-top:0px;padding-bottom:10px; overflow:hidden;}
.betExpandFirst{margin-top:5px;}
.betExpandLast{margin-bottom:0px;}
.expandedList{background-color:#eee;}

.gameCard{white-space: normal;overflow:hidden;}
tr.v-datatable__expand-row > td.v-datatable__expand-col > div.v-datatable__expand-content {background-color:red !important;}

@media screen and (min-width:0px) and (max-width: 960px){
.userPage{width:99%;}
.userHistory{width:100%;;box-shadow:0;}
.accountTxt{overflow:hidden; width: 100%;font-size: 13px;word-break:break-all;}
.myWhiteNum{font-size:18px;}
.dollarIcon{font-size:1.5em;position: absolute; margin-top:5px;}
.accountIcon{font-size:20px;}
.betExpandDesc{min-width:100px;padding:0;}
.betExpandValue{width: 100%;padding:0;padding-left:30px;}
.betExpandLast{margin-bottom:5px;}
}
</style>

<style>
table.v-table thead td:not(:nth-child(1)), table.v-table tbody td:not(:nth-child(1)), table.v-table thead th:not(:nth-child(1)), table.v-table tbody th:not(:nth-child(1)), table.v-table thead td:first-child, table.v-table tbody td:first-child, table.v-table thead th:first-child, table.v-table tbody th:first-child {
    padding: 0 8px;
}
</style>
