<template>
<!-- List에서 UserRank가 있는 파일. 새로 만들 List에는 userRank를 제거한다. 속성이 너무 달라 꼬인다.
훗날 추가하고 싶으면 userRank 페이지를 아예 새로 만들어라. -->
  <div class='listPage'>
    <v-layout row wrap  >
      <v-flex xs12 lg2>
        <img class='teamLogo mt-3' v-if='page.category == 1' v-bind:src="`https://whitebetting.s3.amazonaws.com/league/imgs/${page.id}.png`" v-bind:alt="`${page.decription}`" v-bind:title="`${page.decription}`" v-bind:class="[{'ml-5 ': $vuetify.breakpoint.lgAndUp }]" />
        <img class='teamLogo mt-3' v-else-if='page.category == 2' v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${page.id}.png`" v-bind:alt="`${page.decription}`" v-bind:title="`${page.decription}`" v-bind:class="[{'ml-5 ': $vuetify.breakpoint.lgAndUp }]"  />
        <img v-else src='https://whitebetting.s3.amazonaws.com/game/logo/favicon.svg' alt="wB"  title="wB" class='mt-3' width='100' height='62' v-bind:class="[{'ml-5 ': $vuetify.breakpoint.lgAndUp }]"/>
      </v-flex>
      <v-flex xs12 lg4>
        <h1 class='mt-1 blue--text text--darken-3' v-bind:class="{'mt-5 ml-4': $vuetify.breakpoint.lgAndUp}">{{page.decription}}</h1>
      </v-flex>
    </v-layout>

    <!-- 일반 game list page 용 -->
    <v-layout column v-if='page.category < 6'>
      <v-flex xs12>
        <v-data-table
          class= 'ml-0 mt-3'
          v-bind:class="{'ml-4': $vuetify.breakpoint.mdAndUp}"
          v-bind:headers="filteredTotalBetInfoHeader"
          v-bind:items="gameList"
          v-bind:pagination.sync="paginationSearched"
          v-bind:loading="loader.gameList"
          item-key="number"
          hide-actions
          disable-initial-sort
        >
          <template slot="items" slot-scope="props" >
            <tr v-bind:active="props.selected" >
              <td v-if="!$vuetify.breakpoint.xs" class='searchedNumber text-xs-center'>
                {{ (paginationSearched.page-1) * paginationSearched.rowsPerPage + (props.index + 1) }}
              </td>

              <td class='gameListCell text-xs-center' >
                <router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>
                  <img v-if="props.index == 0" v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${props.item.homeTeam_id}.png`" @error="apiFootballImg($event, props.item.homeTeam_id)" v-bind:alt="`${props.item.homeTeam}`" v-bind:title="`${props.item.homeTeam}`" class='teamLogo_sub'/>
                  <p>{{ props.item.homeTeam }}</p>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.homeTeam }}</p>
                </router-link>
              </td>
              <td class="gameListCell text-xs-center" >
                <router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>
                  <p>Draw</p>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.drawTeam }}</p>
                </router-link>
              </td>
              <td class="gameListCell text-xs-center" >
                <router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>
                  <img v-if="props.index == 0" v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${props.item.awayTeam_id}.png`" @error="apiFootballImg($event, props.item.awayTeam_id)" v-bind:alt="`${props.item.awayTeam}`" v-bind:title="`${props.item.awayTeam}`" class='teamLogo_sub'/>
                  <p>{{ props.item.awayTeam }}</p>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.awayTeam }}</p>
                </router-link>
              </td>

              <!-- over/under 주석처리. 하루전에나 정보가 들어온다 -->
              <td v-if="!$vuetify.breakpoint.xs" class="gameListCell text-xs-center" >
                <router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.over }}</p>
                </router-link>
              </td>
              <td v-if="!$vuetify.breakpoint.xs" class="gameListCell text-xs-center" >
                <router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.under }}</p>
                </router-link>
              </td>
              <td class="gameListCell text-xs-center" v-if="!$vuetify.breakpoint.xs"  >
                <router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>
                  <p>{{ props.item.round }}</p>
                </router-link>
              </td>
              <td class="gameListCell text-xs-center" >
                {{ props.item.event_date_moment }}
              </td>

            </tr>
          </template>

        </v-data-table>
      </v-flex>


    </v-layout>


        <!-- <v-layout row wrap justify-space-between>
        <h3 class="hotGameTxt " >
          <v-icon >attach_money</v-icon>&nbsp;
          <router-link class='hotGameTxt hoverUnderline' v-bind:to='{path:`/group/userRank`}' title='More player rank list'>
          Player Rank 
          </router-link>
        </h3>
          <span class='grey--text text--darken-3 timeUserRank'>[{{userRankList.createdAt_moment}}]</span>
        </v-layout> -->

    <!-- user Rank 용으로 따로 만든다 -->
    <v-layout column v-if='page.category == 6'>
      <v-layout >
        <v-flex xs12 lg9>
          <!-- Player Rank -->
          <p class='grey--text text--darken-3 timeUserRank text-xs-right mr-2'>[{{gameList.createdAt_moment}}]</p>

          <v-data-table
            class= 'ml-0 mt-1'
            v-bind:class="{'ml-4': $vuetify.breakpoint.mdAndUp}"
            v-bind:headers ="filteredUserRankHeader"
            v-bind:items="gameList.userRank"
            v-bind:pagination.sync="paginationSearched"
            v-bind:loading="loader.gameList"
            item-key="number"
            hide-actions
            disable-initial-sort
          >
            <template slot="items" slot-scope="props" >
              <tr v-bind:active="props.selected" >
                <td class='betNumber text-xs-center'>
                  {{ (paginationSearched.page-1) * paginationSearched.rowsPerPage + (props.index + 1) }}
                </td>
                <!-- <td class='betHistoryUser' > <a v-bind:href='`/user/${props.item.user}`'>{{ props.item.user }}</a></td> -->
                <td class='betHistoryUser text-xs-center' ><router-link class='linkColor' v-bind:to='{path:`/user/${props.item.user}`}'>{{ props.item.user }}</router-link></td>
                <td class="betHistoryBet text-xs-center" ><router-link class='linkColor' v-bind:to='{path:`/user/${props.item.user}`}'>{{ props.item.totalStake }}</router-link></td>
                <td class="betHistoryBet text-xs-center" ><router-link class='linkColor' v-bind:to='{path:`/user/${props.item.user}`}'>{{ props.item.totalReturn }}</router-link></td>
              </tr>
            </template>

          </v-data-table>
          <!--/ Player Rank -->

        </v-flex>
      </v-layout>
    </v-layout>

    <!-- Latest Bet 용으로 따로 제작 -->
    <v-layout column v-if='page.category == 7'>
      <v-layout row >
        <v-flex xs12 lg9>
        <v-data-table
          class='userHistory '
          v-bind:class="{'mt-3': $vuetify.breakpoint.mdAndUp}"
          v-bind:headers="filteredBetHeader"
          v-bind:expand="expand"
          v-bind:items="gameList"
          v-bind:loading="loader.gameList"
          hide-actions
          item-key="number"
          v-bind:pagination.sync="paginationSearched"
          disable-initial-sort
        >
          <template slot="items" slot-scope="props" >
            <tr v-on:click="props.expanded = !props.expanded" >
              <td  class='searchedNumber text-xs-center' style='max-width: 40px;'>
                {{ (paginationSearched.page-1) * paginationSearched.rowsPerPage + (props.index + 1) }}
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

            <v-layout row  v-if='props.item.fixture_Obj_id.round' class='expandedList'>
              <v-flex xs2>
                <div class='betExpandDesc'>Round</div>
              </v-flex>
              <v-flex xs10>
                <div class='betExpandValue' >{{props.item.fixture_Obj_id.round}}</div>
              </v-flex>
            </v-layout>

            <v-layout row  v-if='props.item.game' class='expandedList'>
              <v-flex xs2>
                <div class='betExpandDesc'>Game</div>
              </v-flex>
              <v-flex xs10>
                <div class='betExpandValue' >
                  <router-link v-bind:to="'/game/'+ props.item.fixture_id"   class='betExpandTransaction'>
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
                  <a v-bind:href="'https://etherscan.io/tx/'+ props.item.transaction" target='_blank' class='betExpandTransaction'>
                    {{props.item.transaction}}
                  </a>
                </div>
              </v-flex>
            </v-layout>

          </template>
        </v-data-table>

        </v-flex>
      </v-layout>

    </v-layout>

    <v-flex  >
      <div class="text-xs-center pt-2 ">
        <v-pagination v-model="paginationSearched.page" :length="searchedPages" color='blue lighten-2 ' v-bind:total-visible='paginationSearched.totalVisible' ></v-pagination>
      </div>
    </v-flex > 

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

export default {
  name: 'List',
  components: { Loading },
  data () {
    return {
      expand      : false,
      page : { category : '', id : '', decription: '', isTeam: false },
      gameList: [],
      totalMatches : 0,
      pageNum : 1,

      paginationSearched : {page: 1, rowsPerPage : 10 , sortBy: 'number', totalVisible: 5 },
      totalBetInfoHeader: GameData.listGameHeader,
      userRankHeaders: GameData.userRankHeaders,
      betHeaders : GameData.betHeaders,

      teamIcons : GameData.teamIcons,
      league : GameData.league,
      team : GameData.team,

      loader :{ gameList : false },
    }
  },
  methods : {
		...mapActions([
			'changeLoadingStatus',
		]),
    ...mapMutations ([
      'CHANGE_LOADING_STATUS', // 로딩화면 추가
    ]),
    onPageChange(pageNum){
      // this.$router.push({params : {pageNum} })
      // window.history.pushState({page: pageNum-1}, null, null)
      // window.history.replaceState({}, null,`${window.location.pathname}/${pageNum}`)
    },

    async _makePage (pageName) { // 페이지마다 다른 이름, 설명, 로고 넣어주기
      console.log('이거실행!');
      let pageId, pageDec, flagId, category;
      let isTeam = false;
      const leagueIdx = this.league.findIndex( el => el.name == pageName );
      let teamIdx = this.team.findIndex( el => el.name == pageName );
      if (leagueIdx != -1 ){ // 리그 정보를 찾은 후 입력
        pageId = this.league[leagueIdx].id;
        // flagId = this.league[leagueIdx].flagId;
        pageDec = this.league[leagueIdx].fullName;
        category = 1;
      } else if (teamIdx != -1) { // 만약 팀으로 검색이라면
        pageId = this.team[teamIdx].id;
        pageDec = this.team[teamIdx].fullName;
        category = 2;
      } else if (pageName == 'hotgames') {
        pageId = '';
        pageDec = 'Hot Matches';
        category = 3;
      } else if (pageName == 'inplaygames') {
        pageId = '';
        pageDec = 'In-Play Matches';
        category = 4;
      } else if (pageName == 'finishedMatches') {
        pageId = '';
        pageDec = 'Finished Matches';
        category = 5;
      } else if (pageName == 'userRank') {
        pageId = '';
        pageDec = 'Player Rank';
        category = 6;
      } else if (pageName == 'lastestBets') {
        pageId = '';
        pageDec = 'Lastest Bets';
        category = 7;
      }

      this.page.isTeam     = isTeam;
      this.page.name       = pageName;
      this.page.id         = pageId;
      // this.page.flagId     = flagId;
      this.page.decription = pageDec;
      this.page.category   = category;

      try{
        this.loader.gameList = true;
        this.changeLoadingStatus(true);
        const getGameList = await GameAPI.getGameList(this.page );
        // if(!getGameList) this.$router.push('/'); // 나중에 해당 게임이 없을 때 보여줄 페이지

        if (category == 6){ // user Rank 일때 리스트 정리
        console.log('몇번이냐');
          getGameList.createdAt_moment = this.$moment(getGameList.createdAt).fromNow();
          getGameList.userRank.map( user =>{
            user.totalStake= parseInt(user.totalStake*1000)/1000;
            user.totalReturn= parseInt(user.totalReturn*1000)/1000;
          }); // 자릿수 정리
          // getGameList.sort( (a,b)=> b.totalReturn - a.totalReturn );

        } else if (category == 7 ) { // latest bets 일때
          // getGameList.map((gameInfo, idx)=>{
          //   gameInfo.event_date_moment = this.$moment(gameInfo.event_date).fromNow();
          // } )
          getGameList.map( (info, idx)=>{
            // getGameList[idx].number = getGameList.length - idx ;
            getGameList[idx].number = idx + 1 ;
            getGameList[idx].createdAt_moment = this.$moment(info.createdAt).fromNow();
            getGameList[idx].game = `${info.fixture_Obj_id.homeTeam} : ${info.fixture_Obj_id.awayTeam}`;
            getGameList[idx].event_date_moment = this.$moment(info.fixture_Obj_id.event_date).format('ll');
            getGameList[idx].event_date = this.$moment(info.fixture_Obj_id.event_date).format('llll');
            // returnEth 계산 
            if (info.returnEth == undefined ) getGameList[idx].returnEth = 'Not yet';
            else if (info.returnEth == -1) getGameList[idx].returnEth = 'Returned';
            else getGameList[idx].returnEth = info.returnEth;
          })          
          getGameList.sort( (a,b)=> a.createdAt - b.createdAt );
        } else  {
          getGameList.map((gameInfo, idx)=>{
            gameInfo.event_date_moment = this.$moment(gameInfo.event_date).fromNow();
          } )
        }

        this.gameList = getGameList;
        // console.log(this.gameList);
        this.changeLoadingStatus(false);
        this.loader.gameList = false;
      } catch(err) {
        console.log(err);
      }
    },
    apiFootballImg(e, teamId){
      e.target.src =`https://www.api-football.com/public/teams/${teamId}.png`;
      return;
    },
  },
  async created(){
    Util.checkSession(this.$session, this.userAccount); // session 체크
    window.scrollTo(0,0); // 항상 페이지 최상단으로

    this._makePage( this.$route.params.name ); // page 정보 알아낸 후 보여주기
  },

  beforeCreate(){ // 세션처리는 Toolbar에서 한다
    document.getElementById('hello').style.display = 'none';
    document.getElementById('helloTxt').style.display = 'none';
  },
  computed : {
    filteredBetHeader () {
      return this.betHeaders.filter(h => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },    
    searchedPages () { // 검색한 collection 페이지 결정
      if(this.page.category == 6){// user Ranking은 구조가 약간 다르다
      console.log('this.gameList.userRank');
      console.log(this.gameList.userRank);
        // this.paginationSearched.totalItems = this.gameList.userRank.length;
        this.paginationSearched.totalItems = 100;
      } else {
        this.paginationSearched.totalItems = this.gameList.length;
      }

			if (this.paginationSearched.rowsPerPage == null || this.paginationSearched.totalItems == null ) return 0;
			return Math.ceil(this.paginationSearched.totalItems / this.paginationSearched.rowsPerPage)
    },
    filteredTotalBetInfoHeader () {
      return this.totalBetInfoHeader.filter(h => !h.hide || !this.$vuetify.breakpoint[h.hide]);
    },
    filteredUserRankHeader () {
      return this.userRankHeaders.filter(h => !h.hide || !this.$vuetify.breakpoint[h.hide]);
    },

		...mapState([ // state는 computed에 넣는다
			'userAccount', 'loadingStatus',
    ]),
  },
watch: {
    '$route.params.name' : function (pageName) {
      this._makePage(pageName); // vue에서 route의 params이 변경되면 감시하다가 바로 적용
    }
  },
}
</script>


<style scoped>
.userHistory{max-width: 1263px;word-break:break-all;cursor:pointer;background-color:#fff !important;}
.iCodeLink{transform: rotate(180deg);}
.gameListTxt{color:#C2185B;width: 200px;}
.teamLogo{width:auto;height:100px; }
.linkColor{color:rgba(0,0,0,0.87); }
.linkColor:hover{text-decoration: underline;}
.oddTxt{color:#C2185B;}
.gameListCell{max-width: 80px;overflow:hidden;}
.teamLogo_sub{max-width:50px;max-height:70px; margin:10px auto;display:block;}

.timeUserRank{font-size:0.8em;}
.betNumber{max-width:40px;overflow:hidden;}
.betHistoryUser{text-overflow:ellipsis;white-space:nowrap;overflow:hidden;}
.betExpandDesc{padding-left:50px;padding-top:0px;padding-bottom:10px; overflow:hidden;font-weight:bold;}
.betExpandValue{padding-left:0px;padding-top:0px;padding-bottom:10px; overflow:hidden;}
.betExpandFirst{margin-top:5px;}
.betExpandLast{margin-bottom:0px;}
.expandedList{background-color:#eee;}

tr.v-datatable__expand-row > td.v-datatable__expand-col > div.v-datatable__expand-content {background-color:red !important;}

@media screen and (min-width:0px) and (max-width: 960px){
  .betHistoryUser{ max-width: 80px;}
  .betExpandDesc{min-width:100px;padding:0;}
  .betExpandValue{width: 100%;padding:0;padding-left:30px;}
  .betExpandLast{margin-bottom:5px;}  
  table.v-table thead td:not(:nth-child(1)), table.v-table tbody td:not(:nth-child(1)), table.v-table thead th:not(:nth-child(1)), table.v-table tbody th:not(:nth-child(1)), table.v-table thead td:first-child, table.v-table tbody td:first-child, table.v-table thead th:first-child, table.v-table tbody th:first-child{ padding: 0 0 0 5px;}
}
</style>

