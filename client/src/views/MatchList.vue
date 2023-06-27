<template>
  <div class='matchList'>
    <v-layout row wrap  >
      <v-flex xs12 lg2>
        <img src='https://whitebetting.s3.amazonaws.com/game/logo/favicon.svg' alt="wB"  title="wB" class='mt-3' width='100' height='62' v-bind:class="[{'ml-5 ': $vuetify.breakpoint.lgAndUp }]"/>
      </v-flex>
      <v-flex xs12 lg4>
          <h1 class='mt-1 blue--text text--darken-3 refreshInfo' v-bind:class="{'mt-5 ml-4': $vuetify.breakpoint.lgAndUp}">{{page.decription}}
            <v-icon size=25 class='grey--text text--darken-1 l-2' v-on:click='getMatchInfo(1)' style='line-height:30px;display:inline-block;'>refresh</v-icon>
          </h1>
      </v-flex>
    </v-layout>

    <!-- 일반 game list page 용 -->
    <v-layout column>
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

              <td class='gameListCell text-xs-right' >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' style="float: right;" v-on:click.native='mlData'>

                  <img v-if="props.index == 0" v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${props.item.homeTeam_id}.png`" @error="apiFootballImg($event, props.item.homeTeam_id)" v-bind:alt="`${props.item.homeTeam}`" v-bind:title="`${props.item.homeTeam}`" class='teamLogo_sub mt-1' align="right" />
                  <p >{{ props.item.homeTeam }}</p>
                </router-link>
              </td>

              <td class="gameListCell text-xs-center" >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}'>
                  <span class='blue--text text--darken-3' v-on:click.native='mlData'>{{props.item.goalsHomeTeam}}</span>
                  <span> : </span>
                  <span class='blue--text text--darken-3'>{{props.item.goalsAwayTeam}}</span>
                </router-link>
              </td>

              <td class="gameListCell text-xs-left" >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='mlData'>
                  <img v-if="props.index == 0" v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${props.item.awayTeam_id}.png`" @error="apiFootballImg($event, props.item.awayTeam_id)" v-bind:alt="`${props.item.awayTeam}`" v-bind:title="`${props.item.awayTeam}`" class='teamLogo_sub mt-1'/>
                  <span>{{ props.item.awayTeam }}</span>
                </router-link>
              </td>

              <!-- over/under 주석처리. 하루전에나 정보가 들어온다 -->
              <td class="gameListCell text-xs-center" v-if="!$vuetify.breakpoint.xs"  >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='mlData'>
                  <p>{{ props.item.league.name || props.item.round}}</p>
                </router-link>
              </td>
              <td class="gameListCell text-xs-center" v-if="!$vuetify.breakpoint.xs"  >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='mlData'>
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
import mixinDataAnal from '@/commons/mixinDataAnal';

export default {
  name: 'MatchList',
  mixins: [mixinDataAnal],
  components: { Loading },
  data () {
    return {
      page : { category : '', id : '', decription: '', isTeam: false },
      gameList: [],

      paginationSearched : {page: 1, rowsPerPage : 10 , sortBy: 'number', totalVisible: 5 },
      totalBetInfoHeader: GameData.MatchListHeader,

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
    mlData(){
      if(this.page.category == 4 ){// In-Play Matches
        this.dataAnalysis(4101);
      }else if(this.page.category == 5 ){// Finished Matches
        this.dataAnalysis(4201);
      }
    },

    async _makePage (pageName) { // 페이지마다 다른 이름, 설명, 로고 넣어주기
      let pageDec, category;

      // 카테고리 번호는 이전과 동일하게 유지
      if (pageName == 'InplayMatches') {
        pageDec = 'In-Play Matches';
        category = 4;
        this.dataAnalysis(20006);
      } else if (pageName == 'FinishedMatches') {
        pageDec = 'Finished Matches';
        category = 5;
        this.dataAnalysis(20007);
      }
      this.page.name       = pageName;
      this.page.decription = pageDec;
      this.page.category   = category;
    },

    async getMatchInfo (isClicked) { // 새로고침
      if(isClicked==1){
        if(this.page.category == 4 ){// In-Play Matches
          this.dataAnalysis(4100);
        }else if(this.page.category == 5 ){// Finished Matches
          this.dataAnalysis(4200);
        }
      }

      try{
        this.loader.gameList = true;
        this.changeLoadingStatus(true);
        const getGameList = await GameAPI.getMatchInfoList(this.page );

        getGameList.map((gameInfo, idx)=>{
          gameInfo.event_date_moment = this.$moment(gameInfo.event_date).fromNow();
        } )

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
    
    this.deleteHelloDom();
    Util.checkSession(this.$session, this.userAccount); // session 체크
    window.scrollTo(0,0); // 항상 페이지 최상단으로
    await this._makePage( this.$route.name ); // $route.name안에 route에서 설정한 이름이 들어온다. 페이지 정보 세팅
    this.getMatchInfo();// 게임 정보 가져오기
  },

  beforeCreate(){ // 세션처리는 Toolbar에서 한다
  },
  computed : {
    searchedPages () { // 검색한 collection 페이지 결정
      try{
          this.paginationSearched.totalItems = this.gameList.length;
      } catch(err){}

			if (this.paginationSearched.rowsPerPage == null || this.paginationSearched.totalItems == null ) return 0;
			return Math.ceil(this.paginationSearched.totalItems / this.paginationSearched.rowsPerPage)
    },
    filteredTotalBetInfoHeader () {
      return this.totalBetInfoHeader.filter(h => !h.hide || !this.$vuetify.breakpoint[h.hide]);
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
.teamLogo{width:auto;height:100px; }
.linkColor{color:rgba(0,0,0,0.87); }
.linkColor:hover{text-decoration: underline;}
.oddTxt{color:#C2185B;}
.gameListCell{max-width: 80px;overflow:hidden;}
.teamLogo_sub{max-width:50px;max-height:70px; display:block;}
.refreshInfo {margin:0 auto; }
@media screen and (min-width:0px) and (max-width: 960px){
}
</style>