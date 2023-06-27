<template>
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
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='listData((paginationSearched.page-1) * paginationSearched.rowsPerPage + (props.index + 1))'>
                  <img v-if="props.index == 0" v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${props.item.homeTeam_id}.png`" @error="apiFootballImg($event, props.item.homeTeam_id)" v-bind:alt="`${props.item.homeTeam}`" v-bind:title="`${props.item.homeTeam}`" class='teamLogo_sub'/>
                  <p>{{ props.item.homeTeam }}</p>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.homeTeam }}</p>
                </router-link>
              </td>
              <td class="gameListCell text-xs-center" >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='listData((paginationSearched.page-1) * paginationSearched.rowsPerPage + (props.index + 1))'>
                  <p>Draw</p>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.drawTeam }}</p>
                </router-link>
              </td>
              <td class="gameListCell text-xs-center" >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='listData((paginationSearched.page-1) * paginationSearched.rowsPerPage + (props.index + 1))'>
                  <img v-if="props.index == 0" v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${props.item.awayTeam_id}.png`" @error="apiFootballImg($event, props.item.awayTeam_id)" v-bind:alt="`${props.item.awayTeam}`" v-bind:title="`${props.item.awayTeam}`" class='teamLogo_sub'/>
                  <p>{{ props.item.awayTeam }}</p>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.awayTeam }}</p>
                </router-link>
              </td>

              <!-- over/under 주석처리. 하루전에나 정보가 들어온다 -->
              <td v-if="!$vuetify.breakpoint.xs" class="gameListCell text-xs-center" >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='listData((paginationSearched.page-1) * paginationSearched.rowsPerPage + (props.index + 1))'>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.over }}</p>
                </router-link>
              </td>
              <td v-if="!$vuetify.breakpoint.xs" class="gameListCell text-xs-center" >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='listData((paginationSearched.page-1) * paginationSearched.rowsPerPage + (props.index + 1))'>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.under }}</p>
                </router-link>
              </td>
              <td class="gameListCell text-xs-center" v-if="!$vuetify.breakpoint.xs"  v-on:click.native='listData((paginationSearched.page-1) * paginationSearched.rowsPerPage + (props.index + 1))' >
                <router-link v-if='props.item.league' class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}'>
                  <p>{{ props.item.league.name || props.item.round}}</p>
                </router-link>
                <router-link v-else class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='listData((paginationSearched.page-1) * paginationSearched.rowsPerPage + (props.index + 1))'>
                  <p>{{ page.shortName}}</p>
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

    <!-- Player Rank 용으로 따로 만든다 -->
    <v-layout column v-if='page.category == 6'>
      <v-layout >
        <v-flex xs12 lg9>
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
                <td class='betHistoryUser text-xs-center' ><router-link class='linkColor' v-bind:to='{path:`/user/${props.item.user}`}' v-on:click.native='dataAnalysis( 6300 + ((paginationSearched.page-1) * paginationSearched.rowsPerPage + props.index) )'>{{ props.item.user }}</router-link></td>
                <td class="betHistoryBet text-xs-center" ><router-link class='linkColor' v-bind:to='{path:`/user/${props.item.user}`}' v-on:click.native='dataAnalysis( 6300 + ((paginationSearched.page-1) * paginationSearched.rowsPerPage + props.index) )'>{{ props.item.totalStake }}</router-link></td>
                <td class="betHistoryBet text-xs-center" ><router-link class='linkColor' v-bind:to='{path:`/user/${props.item.user}`}' v-on:click.native='dataAnalysis( 6300 + ((paginationSearched.page-1) * paginationSearched.rowsPerPage + props.index) )'>{{ props.item.totalReturn }}</router-link></td>
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
                <div class='betExpandDesc'>Match</div>
              </v-flex>
              <v-flex xs10>
                <div class='betExpandValue' >
                  <router-link v-bind:to="'/football/'+ props.item.fixture_id"   class='betExpandTransaction' v-on:click.native='dataAnalysis(6401)'>
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
                  <a v-bind:href="'https://etherscan.io/tx/'+ props.item.transaction" target='_blank' class='betExpandTransaction' v-on:click='dataAnalysis(6402)'>
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
import mixinDataAnal from '@/commons/mixinDataAnal';

export default {
  name: 'List',
  components: { Loading },
  mixins: [mixinDataAnal],
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
    listData(num){
      // 너무 일을 키우는 것 같은 기분이다 20.02.11
      const category = this.page.category;
      if(category == 1){
        const id = this.page.id;
        switch(id){
          case 524 : this.dataAnalysis(6101);break;
          case 775 : this.dataAnalysis(6102);break;
          case 754 : this.dataAnalysis(6103);break;
          case 891 : this.dataAnalysis(6104);break;
          case 525 : this.dataAnalysis(6105);break;
          case 530 : this.dataAnalysis(6106);break;
          case 514 : this.dataAnalysis(6107);break;
          case 403 : this.dataAnalysis(6108);break;
        }
      } else if(category == 2){
        const id = this.page.id;
        switch(id){
          case 40  : this.dataAnalysis(6201);break;
          case 50  : this.dataAnalysis(6202);break;
          case 47  : this.dataAnalysis(6203);break;
          case 33  : this.dataAnalysis(6204);break;
          case 42  : this.dataAnalysis(6205);break;
          case 49  : this.dataAnalysis(6206);break;
          case 529 : this.dataAnalysis(6207);break;
          case 530 : this.dataAnalysis(6208);break;
          case 541 : this.dataAnalysis(6209);break;
          case 157 : this.dataAnalysis(6210);break;
          case 496 : this.dataAnalysis(6211);break;
          case 85  : this.dataAnalysis(6212);break;
        }
      } else if(category == 3){// hot games
        // console.log('hot matches');
        this.dataAnalysis(5000+ num);// 5001부터 5999까지 유효하다
      }
    },
    onPageChange(pageNum){
      // this.$router.push({params : {pageNum} })
      // window.history.pushState({page: pageNum-1}, null, null)
      // window.history.replaceState({}, null,`${window.location.pathname}/${pageNum}`)
    },

    async _makePage (pageName) { // 페이지마다 다른 이름, 설명, 로고 넣어주기
      let pageId, pageDec, flagId, category;
      let isTeam = false;
      const leagueIdx = this.league.findIndex( el => el.name == pageName );
      let teamIdx = this.team.findIndex( el => el.name == pageName );

      if (leagueIdx != -1 ){ // 리그 정보를 찾은 후 입력
        pageId = this.league[leagueIdx].id;
        // flagId = this.league[leagueIdx].flagId;
        pageDec = this.league[leagueIdx].fullName;
        this.page.shortName = this.league[leagueIdx].name;//리그 이름이 길어 여기에만 짧게 넣는다.
        category = 1;
        switch(pageId){
          case 524 : this.dataAnalysis(20010);break;// EPL
          case 775 : this.dataAnalysis(20011);break;// La Liga
          case 754 : this.dataAnalysis(20012);break;// Bundesliga
          case 891 : this.dataAnalysis(20013);break;// Serie A
          case 525 : this.dataAnalysis(20014);break;// France Lique1
          case 530 : this.dataAnalysis(20015);break;// UEFA Champions League
          case 514 : this.dataAnalysis(20016);break;// Europa League
          case 403 : this.dataAnalysis(20017);break;// Euro Championship
        }        
      } else if (teamIdx != -1) { // 만약 팀으로 검색이라면
        pageId = this.team[teamIdx].id;
        pageDec = this.team[teamIdx].fullName;
        category = 2;
        switch(pageId){
          case 40  : this.dataAnalysis(21001);break;// Liverpool
          case 50  : this.dataAnalysis(21002);break;// manCity
          case 47  : this.dataAnalysis(21003);break;// tottenham
          case 33  : this.dataAnalysis(21004);break;// manUnited
          case 42  : this.dataAnalysis(21005);break;// arsenal
          case 49  : this.dataAnalysis(21006);break;// chelsea
          case 529 : this.dataAnalysis(21007);break;// barcelona
          case 530 : this.dataAnalysis(21008);break;// atletico
          case 541 : this.dataAnalysis(21009);break;// realMadrid
          case 157 : this.dataAnalysis(21010);break;// munich
          case 496 : this.dataAnalysis(21011);break;// juventus
          case 85  : this.dataAnalysis(21012);break;// parisSaintGermain
        }           
      } else if (pageName == 'hotgames') {
        pageId = '';
        pageDec = 'Hot Matches';
        category = 3;
        this.dataAnalysis(20005);
        // category 4,5는 MatchList.vue로 뺀다 200206
      } else if (pageName == 'userRank') {
        pageId = '';
        pageDec = 'Player Rank';
        category = 6;
        this.dataAnalysis(20008);
      } else if (pageName == 'lastestBets') {
        pageId = '';
        pageDec = 'Lastest Bets';
        category = 7;
        this.dataAnalysis(20009);
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
            else if (info.returnEth == -1) getGameList[idx].returnEth = 'Refunded';
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
  created(){
    this.deleteHelloDom();    
    Util.checkSession(this.$session, this.userAccount); // session 체크
    window.scrollTo(0,0); // 항상 페이지 최상단으로

    this._makePage( this.$route.params.name ); // page 정보 알아낸 후 보여주기
  },

  beforeCreate(){ // 세션처리는 Toolbar에서 한다
  },
  computed : {
    filteredBetHeader () {
      return this.betHeaders.filter(h => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
    searchedPages () { // 검색한 collection 페이지 결정
      try{
        if(this.page.category == 6){// user Ranking은 구조가 약간 다르다
          this.paginationSearched.totalItems = this.gameList.userRank.length;
        } else {
          this.paginationSearched.totalItems = this.gameList.length;
        }
      } catch(err){}

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

