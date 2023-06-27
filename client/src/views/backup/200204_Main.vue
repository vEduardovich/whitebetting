<template>
  <div class='mainPage' >

    <v-layout row wrap  >
      <v-flex xs12 lg8  >

        <div class="announcements">
          <v-layout row wrap justify-center>
          <v-icon class='bell' color='pink lighten-1'>notifications</v-icon>
          <carousel v-bind:data="announcements" v-bind:controls=false v-bind:indicators=false :interval="4000" direction="up" class='mt-1 hoverUnderline '></carousel>
          </v-layout>
        </div>

        <h3 class="mt-4 ml-1 mb-2 hotGameTxt " v-bind:class="{'mt-4 ml-4': $vuetify.breakpoint.mdAndUp}"  >
          <v-icon >whatshot</v-icon>&nbsp;
          <router-link class='hotGameTxt hoverUnderline' v-bind:to='{path:`/group/hotgames`}' title='More hot games'>
          Hot Matches
          </router-link>
        </h3>

        <!-- Hot Game List -->
        <v-data-table
          class= 'ml-0 hotGameList'
          v-bind:class="{'ml-4': $vuetify.breakpoint.mdAndUp}"
          v-bind:headers="filteredHotGamesHeaders"
          v-bind:items="hotGameList"
          v-bind:pagination.sync="listLen.hotGameList"
          v-bind:loading="loader.hotGameList"
          item-key="number"
          hide-actions
          disable-initial-sort
        >
          <template slot="items" slot-scope="props" >
            <tr>
              <td class='betNumber text-xs-center' v-if="!$vuetify.breakpoint.xs">{{ props.index + 1 }}</td>
              <td class='betGameInfo text-xs-center' >
                <router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>

                  <img v-if="props.index == 0" v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${props.item.homeTeam_id}.png`" @error="apiFootballImg($event, props.item.homeTeam_id)" v-bind:alt="`${props.item.homeTeam}`" v-bind:title="`${props.item.homeTeam}`" class='teamLogo'/> 
                  <p>{{ props.item.homeTeam }}</p>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.homeTeam }}</p>
                </router-link>
              </td>
              <td class='betGameInfo text-xs-center'  >
                <router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>
                  <p>Draw</p>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.drawTeam }}</p>
                </router-link>
              </td>
              <td class="betGameInfo text-xs-center"  >
                <router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>
                  <img v-if="props.index == 0" v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${props.item.awayTeam_id}.png`" @error="apiFootballImg($event, props.item.awayTeam_id)" v-bind:alt="`${props.item.awayTeam}`" v-bind:title="`${props.item.awayTeam}`" class='teamLogo'/>                   
                  <p>{{ props.item.awayTeam }}</p>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.awayTeam }}</p>
                </router-link>
              </td>
              <td class="betGameOverUnder text-xs-center" v-if="!$vuetify.breakpoint.xs"  >
                <router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>
                  <p>{{ props.item.round }}</p>
                </router-link>
              </td>              

              <td class="betGameFromNow text-xs-center"  >
                <router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>
                <p>{{ props.item.event_date_fromNow }}</p>
                </router-link>  
              </td>                
              <!-- <td class="betHistoryGame" v-if="!$vuetify.breakpoint.xs" >{{ props.item.status }}</td> -->

            </tr>
          </template>

        </v-data-table>
        <!-- Hot Game List -->
      </v-flex>

      <v-flex xs12 lg3 class='ml-0 teamIconGroup' v-bind:class="{'mt-0 ml-4': $vuetify.breakpoint.mdAndUp}" >
        <!-- 이미지 사진 -->
        <v-flex v-if="!$vuetify.breakpoint.smAndDown" >
          <div style='overflow:hidden;'>
            <!-- 아래와 같이 만들면 항상 새로운 메인이미지를 가져온다 -->
            <img v-bind:src="`https://whitebetting.s3.amazonaws.com/game/mainImgs/mainImage.jpg?${Date.now()}`" alt='Main Image' title="Main Image" class='mainImage'/>
          </div>
        </v-flex>

        <h3 class="mt-4 ml-1 mb-2 hotGameTxt " v-bind:class="{'mt-4 ml-4': $vuetify.breakpoint.mdAndUp}"  >
          <v-icon >group_work</v-icon>
          Hot Teams
        </h3>

        <v-layout row wrap  >
          <v-flex xs4 sm2 lg4 v-for='(team,idx) in teamIcons' v-bind:key='idx' >
            <router-link v-bind:to="`/group/${team.name}`" v-bind:title='`Go to ${team.fullName} page`'>
              <img v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${team.id}.png`" v-bind:alt="`${team.fullName}`" v-bind:title="`${team.fullName}`" class='teamLogo'/>
            </router-link>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <!-- Playing Games & Finished Matches -->
    <v-layout row wrap  >
      <v-flex class='mt-4 ' xs12 lg5 v-bind:class="[ {'ml-4': $vuetify.breakpoint.mdAndUp}]"  >
        <h3 class="hotGameTxt " >
          <v-icon class='fa fa-soccer-ball-o'></v-icon>&nbsp;
          <router-link class='hotGameTxt hoverUnderline' v-bind:to='{path:`/group/inplaygames`}' title='More in-play games'>
          In-Play Matches
          </router-link>
        </h3>

        <!-- In-Play Matches -->
        <v-data-table
          v-bind:headers ="inPlayAndClosedGameList"
          v-bind:items="inPlayGameList"
          :pagination.sync="listLen.inPlayGameList"
          v-bind:loading="loader.inPlayGameList"
          item-key="number"
          hide-actions
          disable-initial-sort
          class='userRankList'
        >
          <template slot="items" slot-scope="props" >
            <tr>
              <td class='betHistoryUser text-xs-left pl-2' ><router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>{{ props.item.game }}</router-link></td>
              <td class="betHistoryBet text-xs-center" ><router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>{{ props.item.event_date_fromNow }}</router-link></td>
            </tr>
          </template>

        </v-data-table>
        <!--/ Player Rank -->

      </v-flex>
      <v-flex class='mt-4 ' xs12 lg5 v-bind:class="{'ml-5': $vuetify.breakpoint.mdAndUp}"  >
        <h3 class="hotGameTxt ml-1">
          <v-icon class='far fa-calendar-alt'></v-icon>&nbsp;
          <router-link class='hotGameTxt hoverUnderline' v-bind:to='{path:`/group/finishedMatches`}' title='More closed games'>
          Finished Matches
          </router-link>
        </h3>

        <!-- Finished Matches -->
        <v-data-table
          v-bind:headers="inPlayAndClosedGameList"
          v-bind:items="closedGameList"
          v-bind:pagination.sync="listLen.closedGameList"
          v-bind:loading="loader.closedGameList"
          item-key="createdAt_moment"
          hide-actions
          disable-initial-sort
          class='lastestBetList'
        >
          <template slot="items" slot-scope="props" >
            <tr>
              <td class='betHistoryUser text-xs-left pl-2' ><router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>{{ props.item.game }}</router-link></td>
              <td class="betHistoryBet text-xs-center" ><router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>{{ props.item.event_date_fromNow }}</router-link></td>
            </tr>
          </template>

        </v-data-table>
        <!--/ Lastest Bets -->
      </v-flex>

    </v-layout>


    <!-- 하단 info -->
    <v-layout row wrap  >
      <v-flex class='mt-4 ' xs12 lg5 v-bind:class="[ {'ml-4': $vuetify.breakpoint.mdAndUp}]"  >
        <v-layout row wrap justify-space-between>
        <h3 class="hotGameTxt " >
          <v-icon >attach_money</v-icon>&nbsp;
          Player Rank 
          <!-- <router-link class='hotGameTxt hoverUnderline' v-bind:to='{path:`/group/userRank`}' title='More player rank list'>
          Player Rank 
          </router-link> -->
        </h3>
          <span class='grey--text text--darken-3 timeUserRank mr-2'>[{{userRankList.createdAt_moment}}]</span>
        </v-layout>
        

        <!-- Player Rank -->
        <v-data-table
          v-bind:headers ="userRankHeaders"
          v-bind:items="userRankList.userRank"
          :pagination.sync="listLen.userRank"
          v-bind:loading="loader.userRank"
          item-key="number"
          hide-actions
          disable-initial-sort
          class='userRankList'
        >
          <template slot="items" slot-scope="props" >
            <tr>
              <td class='betNumber text-xs-center'>{{ props.index + 1 }}</td>
              <!-- <td class='betHistoryUser' > <a v-bind:href='`/user/${props.item.user}`'>{{ props.item.user }}</a></td> -->
              <td class='betHistoryUser text-xs-center' ><router-link class='linkColor' v-bind:to='{path:`/user/${props.item.user}`}'>{{ props.item.user }}</router-link></td>
              <td class="betHistoryBet text-xs-center" ><router-link class='linkColor' v-bind:to='{path:`/user/${props.item.user}`}'>{{ props.item.totalStake }}</router-link></td>
              <td class="betHistoryBet text-xs-center" ><router-link class='linkColor' v-bind:to='{path:`/user/${props.item.user}`}'>{{ props.item.totalReturn }}</router-link></td>
            </tr>
          </template>

        </v-data-table>
        <!--/ Player Rank -->

      </v-flex>
      <v-flex class='mt-4 ' xs12 lg5 v-bind:class="{'ml-5': $vuetify.breakpoint.mdAndUp}"  >
        <h3 class="hotGameTxt ml-1">
          <v-icon class='fab fa-ethereum'></v-icon>
          <router-link class='hotGameTxt hoverUnderline ml-1' v-bind:to='{path:`/group/lastestBets`}' title='More lastest bets list'>Lastest Bets
          </router-link>          
        </h3>

        <!-- Lastest Bets -->
        <v-data-table
          v-bind:headers="latestBetsHeaders"
          v-bind:items="latestBetsList"
          v-bind:pagination.sync="listLen.lastBet"
          v-bind:loading="loader.latestBetsList"
          item-key="createdAt_moment"
          hide-actions
          disable-initial-sort
          class='lastestBetList'
        >
          <template slot="items" slot-scope="props" >
            <tr>
              <td class="createdLatestBets text-xs-center" >{{ props.item.createdAt_moment }}</td>
              <td class='betHistoryUser' ><router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>{{ props.item.user }}</router-link></td>
              <td class="betHistoryGame text-xs-center"><router-link class='linkColor' v-bind:to='{path:`/game/${props.item.fixture_id}`}'>{{ props.item.stake }}</router-link></td>
            </tr>
          </template>

        </v-data-table>
        <!--/ Lastest Bets -->
      </v-flex>

    </v-layout>

    <v-layout row wrap  >
      <v-flex xs12 lg9 >
        <h3 class="mt-4 ml-1 mb-2 hotGameTxt " v-bind:class="{'mt-4 ml-4': $vuetify.breakpoint.mdAndUp}"  >
          <v-icon >whatshot</v-icon>
          How to bet
        </h3>
        <iframe width="100%" height="315"  src="https://www.youtube.com/embed/FH9zpi-g6zA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class='gameGuide' ></iframe>
      </v-flex>

    </v-layout>

		<!-- adding loading icon -->
		<Loading v-if='loadingStatus'/>
  </div>
</template>

<script>
import GameData from '@/commons/gameData';
import gameAPI from '@/commons/gameAPI';
const GameAPI = new gameAPI();
import util from '@/commons/util';
const Util    = new util();
import { mapState, mapActions, mapMutations } from 'vuex';
import Loading from '@/components/Loading'

export default {
  name : 'Main',
  components: { Loading },  
  data () {
    return {
      isMobile : (window.innerWidth < 1264) ? true : false,
      teamIcons : GameData.mainPageTeamIcons,
      announcements: GameData.announcements,
      hotGameList : [],
      hotGameHeaders: GameData.gameHeader,

      inPlayGameList : [],
      closedGameList : [],
      inPlayAndClosedGameList : [
        { text : 'Game'   , align: 'center', sortable: false, value: 'game'       },
        { text : 'Start Time', align: 'center', sortable: false, value: 'event_date_fromNow'},        
      ],

      userRankList : [],
      userRankHeaders: GameData.userRankHeaders,

      latestBetsList : [],
      latestBetsHeaders: [
        { text: 'Placed', align: 'center', sortable: false, value: 'createdAt_moment', },
        { text: 'Player'   , align: 'center', sortable: false, value: 'user'            , },
        { text: 'Stake'  , align: 'center', sortable: false, value: 'stake'           , },
      ],
      // vuetify에서는 rowPerPage가 예약어로 되어있다. 그래서 꼭 아래와 같이 넣어줘야 에러가 안난다. 19.08.19
      listLen  : { hotGameList : { rowsPerPage : 10 }, inPlayGameList : { rowsPerPage : 5 }, closedGameList : { rowsPerPage : 5 }, userRank : { rowsPerPage : 5 }, latestBetsList : { rowsPerPage : 5 }},
      loader :{ hotGameList : false, inPlayGameList : false, closedGameList : false, userRank: false, latestBetsList : false, },
    }
  },
  methods: {
		...mapActions([ // store.js에 있는 changeLoadingStatus함수로 CHANGE_LOADING_STATUS를 바꾸면 loadingStatus가 바뀐다.
			'changeLoadingStatus',
		]),
    ...mapMutations ([
      'CHANGE_LOADING_STATUS', // 로딩화면 추가
		]),     
    // linkGame (fixtureId) {
    //   window.open(`/game/${fixtureId}`);
    // }
    async _getHotGameListFuc(){ // get hot games list
      this.changeLoadingStatus(true); 
      this.loader.hotGameList = true;
      const tempGameList = await GameAPI.getHotGameList(); // bet history

      tempGameList.map( info => {
        info.event_date_fromNow = this.$moment(info.event_date).fromNow(); // moment 상대날짜 처리
      });
      this.hotGameList = tempGameList;
      this.changeLoadingStatus(false); 
      this.loader.hotGameList = false; 
    },
    async _getInPlayGameListFuc(){ // get in-play games list
      this.loader.inPlayGameList = true;
      const inPlayGameList = await GameAPI.getInPlayGameList();
      inPlayGameList.map( (info, idx)=>{ // 여기서 부터 작업
        inPlayGameList[idx].game = `${info.homeTeam} : ${info.awayTeam}`;
        inPlayGameList[idx].event_date_fromNow = this.$moment(info.event_date).fromNow();
      })
    this.inPlayGameList = inPlayGameList;
    this.loader.inPlayGameList = false;
    },
    async _getClosedGameListFuc(){ // get closed games list
      this.loader.closedGameList = true;    
      const closedGameList = await GameAPI.getClosedGameList();
      closedGameList.map( (info, idx)=>{ // 여기서 부터 작업
        closedGameList[idx].game = `${info.homeTeam} : ${info.awayTeam}`;
        closedGameList[idx].event_date_fromNow = this.$moment(info.event_date).fromNow();
      })      
      this.closedGameList = closedGameList;
      this.loader.closedGameList = false;      
    },
    async _getUserRankListFuc(){ // get user rank
      this.loader.userRank = true;
      const tempUserRank = await GameAPI.getUserRankList(); // user rank list
      // console.log(tempUserRank.userRank);
      tempUserRank.createdAt_moment = this.$moment(tempUserRank.createdAt).fromNow();
      tempUserRank.userRank.map( user =>{
        user.totalStake= parseInt(user.totalStake*1000)/1000;
        user.totalReturn= parseInt(user.totalReturn*1000)/1000;
      }); // 자릿수 정리

      // tempUserRank.sort( (a,b)=> b.totalReturn - a.totalReturn );
      this.userRankList = tempUserRank;
      this.loader.userRank = false;
    },
    async _getLatestBetsListFuc(){ // get lastest bets list
      this.loader.latestBetsList = true;
      const tempLatestBetsList = await GameAPI.getLatestBetsList(); // latest bets list
      tempLatestBetsList.map( (info, idx)=>{
        tempLatestBetsList[idx].createdAt_moment = this.$moment(info.createdAt).fromNow();
      })
      this.latestBetsList = tempLatestBetsList;
      this.loader.latestBetsList = false;
    },

    apiFootballImg(e, teamId){
      e.target.src =`https://www.api-football.com/public/teams/${teamId}.png`;
      return;
    },    
  },
  computed : {
    filteredHotGamesHeaders () {
      return this.hotGameHeaders.filter(h => !h.hide || !this.$vuetify.breakpoint[h.hide]);
    },
		...mapState([ // state는 computed에 넣는다
			'userAccount','loadingStatus',
    ]),
  },
  watch : {

  },
  async created(){
    Util.checkSession(this.$session, this.userAccount); // session 체크
    window.scrollTo(0,0); // 항상 페이지 최상단으로

    this._getHotGameListFuc(); // get hot games list
    this._getInPlayGameListFuc(); // get in-play games list
    this._getClosedGameListFuc(); // get closed games list
    this._getUserRankListFuc(); // get user rank
    this._getLatestBetsListFuc(); // get lastest bets list

  },
  beforeCreate(){ // 세션처리는 Toolbar에서 한다 
    document.getElementById('hello').style.display = 'none';
    document.getElementById('helloTxt').style.display = 'none';
  },

}

</script>

<style scoped >
.mainPage{overflow:hidden;}
/* .mainImage{width:300px;margin:10px auto 0px;height:auto;display:block;filter: grayscale(60%);border-radius:5px;} */
.mainImage{width:340px;height:auto;margin:5px auto 0px;height:auto;display:block;border-radius:5px;}
.subImage{width:200px;margin-top:0px;height:auto;display:block;filter: grayscale(60%);border-radius:5px;}
.bell{  animation: ring 4s 0.7s ease-in-out;
  transform-origin: 50% 4px;animation-iteration-count: 1;}
@keyframes ring {
  0% { transform: rotate(0); }
  1% { transform: rotate(23deg); }
  3% { transform: rotate(-24deg); }
  5% { transform: rotate(26deg); }
  7% { transform: rotate(-32deg); }
  9% { transform: rotate(26deg); }
  11% { transform: rotate(-25deg); }
  13% { transform: rotate(24deg); }
  15% { transform: rotate(-23deg); }
  17% { transform: rotate(22deg); }
  19% { transform: rotate(-20deg); }
  21% { transform: rotate(18deg); }
  23% { transform: rotate(-16deg); }
  25% { transform: rotate(14deg); }
  27% { transform: rotate(-12deg); }
  29% { transform: rotate(10deg); }
  31% { transform: rotate(-8deg); }
  33% { transform: rotate(6deg); }
  35% { transform: rotate(-4deg); }
  37% { transform: rotate(2deg); }
  39% { transform: rotate(-1deg); }
  41% { transform: rotate(1deg); }

  43% { transform: rotate(0); }
  100% { transform: rotate(0); }
}
.hotGameTxt{color:#C2185B;width: 200px;}
.timeUserRank{font-size:0.8em;line-height:25px;}
.teamLogo{width:70px;max-height:90px; margin:10px auto;display:block;line-height:70px;}
/* .teamLogo2{max-width:30px;max-height:60px; margin:10px auto;display:block;} */
.teamIconGroup{background-color:#fafafa;border-radius:5px;}

.announcements {border: 1px solid #eee;border-radius: 0.25rem;display: flex;padding: 0.5rem 0.75rem;background-color: #fff;}
.announcements > .carousel {flex: 1;}
.announcements-content {align-items: center;display: flex;justify-content: space-between;}

/* .hotGameList {box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12) !important;} */
.hotGameList {background-color:#fff !important;}
.userRankList {background-color:#fff !important;}
.lastestBetList {background-color:#fff !important;}
.createdLatestBets{min-width:60px;}

.betNumber{max-width:40px;overflow:hidden;}
.betGameInfo{max-width: 120px;overflow:hidden;}
.betGameOverUnder{min-width: 50px;overflow:hidden;}
.betGameFromNow{max-width: 150px;overflow:hidden;}
.betHistoryUser{ max-width: 150px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;}

.gameGuide{padding-left:24px;}
.linkColor{color:rgba(0,0,0,0.87); }
.linkColor:hover{text-decoration: underline;}
.hoverUnderline{text-decoration: underline;}

.oddTxt{color:#C2185B;}

table.v-table thead td:not(:nth-child(1)), table.v-table tbody td:not(:nth-child(1)), table.v-table thead th:not(:nth-child(1)), table.v-table tbody th:not(:nth-child(1)), table.v-table thead td:first-child, table.v-table tbody td:first-child, table.v-table thead th:first-child, table.v-table tbody th:first-child {
    padding: 0 0 0 4px;
}

@media screen and (min-width:0px) and (max-width: 960px){
  .betGameInfo{max-width: 44px;}
  .betGameFromNow{min-width:50px;}
  .teamLogo{width:50px;max-height:70px; margin:10px auto;display:block;line-height:70px;}
  .gameGuide{padding-left:0px;}

  .betHistoryUser{ max-width: 80px;}
  table.v-table thead td:not(:nth-child(1)), table.v-table tbody td:not(:nth-child(1)), table.v-table thead th:not(:nth-child(1)), table.v-table tbody th:not(:nth-child(1)), table.v-table thead td:first-child, table.v-table tbody td:first-child, table.v-table thead th:first-child, table.v-table tbody th:first-child{ padding: 0 0 0 5px;}

}
</style>

