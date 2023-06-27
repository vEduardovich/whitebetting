<template>
  <div class='mainPage' >

    <v-layout row wrap  >
      <v-flex xs12 lg8  >

        <div class="announcements">
          <v-layout row wrap justify-center>
          <v-icon class='bell' color='pink lighten-1'>notifications</v-icon>
          <a v-on:click='dataAnalysis(2100)'>
          <carousel v-bind:data="announcements" v-bind:controls=false v-bind:indicators=false :interval="4000" direction="up" class='mt-1 hoverUnderline '></carousel>
          </a>
          </v-layout>
        </div>

        <h3 class="mt-4 ml-1 mb-2 hotGameTxt text-xs-left" v-bind:class="{'mt-4 ml-4': $vuetify.breakpoint.mdAndUp}"  >
          <v-icon >whatshot</v-icon>&nbsp;
          <router-link class='hotGameTxt hoverUnderline' v-bind:to='{path:`/group/hotgames`}' v-on:click.native='dataAnalysis(2200)' title='More hot games'>
          Hot Matches
          </router-link>
          <!-- </button> -->
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
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='dataAnalysis(2201+props.index)'>

                  <img v-if="props.index == 0" v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${props.item.homeTeam_id}.png`" @error="apiFootballImg($event, props.item.homeTeam_id)" v-bind:alt="`${props.item.homeTeam}`" v-bind:title="`${props.item.homeTeam}`" class='teamLogo'/>
                  <p>{{ props.item.homeTeam }}</p>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.homeTeam }}</p>
                </router-link>
              </td>
              <td class='betGameInfo text-xs-center'  >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='dataAnalysis(2201+props.index)'>
                  <p>Draw</p>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.drawTeam }}</p>
                </router-link>
              </td>
              <td class="betGameInfo text-xs-center"  >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='dataAnalysis(2201+props.index)'>
                  <img v-if="props.index == 0" v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${props.item.awayTeam_id}.png`" @error="apiFootballImg($event, props.item.awayTeam_id)" v-bind:alt="`${props.item.awayTeam}`" v-bind:title="`${props.item.awayTeam}`" class='teamLogo'/>
                  <p>{{ props.item.awayTeam }}</p>
                  <p class='oddTxt'>{{ props.item.odd && props.item.odd.awayTeam }}</p>
                </router-link>
              </td>
              <td class="betGameOverUnder text-xs-center" v-if="!$vuetify.breakpoint.xs"  >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='dataAnalysis(2201+props.index)'>
                  <!-- <p>{{ props.item.round }}</p> -->
                  <p>{{ props.item.league.name || props.item.round}}</p>
                </router-link>
              </td>

              <td class="betGameFromNow text-xs-center"  >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='dataAnalysis(2201+props.index)'>
                <p>{{ props.item.event_date_fromNow }}</p>
                </router-link>
              </td>
              <!-- <td class="betHistoryGame" v-if="!$vuetify.breakpoint.xs" >{{ props.item.status }}</td> -->

            </tr>
          </template>

        </v-data-table>
        <!-- Hot Game List -->
      </v-flex>

      <v-flex xs12 lg3 class='ml-2 teamIconGroup' v-bind:class="{'mt-0 ml-4': $vuetify.breakpoint.mdAndUp}" >
        <v-flex v-if="!$vuetify.breakpoint.smAndDown" >
          <div style='overflow:hidden;'>
            <!-- 아래와 같이 만들면 항상 새로운 메인이미지를 가져온다 -->
            <img v-bind:src="`https://whitebetting.s3.amazonaws.com/game/mainImgs/mainImage.jpg?${Date.now()}`" alt='Main Image' title="Main Image" class='mainImage'/>
          </div>
        </v-flex>

      <!--Start, Comments Part-->
        <h3 class="mt-4 mb-2 hotGameTxt text-xs-left" v-bind:class="{'ml-4 mt-4': $vuetify.breakpoint.mdAndUp}"  >
          <v-icon >chat</v-icon>
          <router-link class='hotGameTxt hoverUnderline ml-1' v-bind:to='{path:`/hotcomments`}' title='New Comments' v-on:click.native='dataAnalysis(2300)'>Comments
          </router-link>
        </h3>

        <v-layout row wrap v-bind:class="[{'pl-4 mainMobileComments': $vuetify.breakpoint.smAndDown },{'mainPcComments': $vuetify.breakpoint.mdAndUp } ]">
          <div v-for="(comment, idx) in comments" v-bind:key='idx' class="py-1 grey--text text--darken-2 newAppendedComment " v-bind:class="[{'pl-4': $vuetify.breakpoint.lgAndUp } ]">
            <div class="text-xs-left pt-2">
              <v-layout row wrap >
                <router-link v-if='comment.user'  class='grey--text text--darken-1'  v-bind:to='{path:`/user/${comment.user}`}' title='Go to the player page' v-on:click.native='dataAnalysis(2301)'>
                  <div class='commentAvatar'>
                    <img v-bind:src="comment.avatar" class='commentAvatarSize'>
                  </div>
                </router-link>
                <div v-else class='commentAvatar'>
                  <img v-bind:src="comment.avatar" class='commentAvatarSize'>
                </div>

                <router-link v-if='comment.user' class='grey--text text--darken-1' v-bind:to='{path:`/user/${comment.user}`}' title='Go to the player page' v-on:click.native='dataAnalysis(2301)'>
                  <h4 class='mb-1 commentNickname' >{{comment.nickname}}</h4>
                </router-link>
                <h4 v-else class='mb-1 commentNickname'>{{comment.nickname}}</h4>
                <span class='ml-2 grey--text text--darken-1' style='font-size:0.9em;line-height:40px;'>{{comment.moment}}</span>

              </v-layout>
              <p class='mt-2' v-if='comment.fixture_id'>
                <router-link class='grey--text text--darken-1' v-bind:to='{path:`/football/${comment.fixture_id}`}' title='More hot games' v-on:click.native='dataAnalysis(2302)'>
                  <span>{{comment.fixture_Obj_id.homeTeam}}</span>
                  <span class='pink--text text--darken-2'>{{comment.fixture_Obj_id.odd.homeTeam}}</span>
                  <span class='ml-1'>Draw</span><span class='pink--text text--darken-2'>{{comment.fixture_Obj_id.odd.drawTeam}}</span>
                  <span class='ml-1'>{{comment.fixture_Obj_id.awayTeam}}</span>
                  <span class='pink--text text--darken-2'>{{comment.fixture_Obj_id.odd.awayTeam}}</span>
                </router-link>
              </p>
              <p v-html="comment.article" class='mt-1' v-bind:class="[{'grey--text text--lighten-2':comment.isDeleted }]"></p>

            </div>

            <!-- 코멘트의 답글 리스트 -->
            <div v-for="(reply, reIdx ) in comment.sub_comment_arr" v-bind:key='reIdx' class="grey--text text--darken-2 newAppendedReply">
              <div class="text-xs-left pt-2 pl-4" v-if='!reply.isDeleted' >
                <v-layout row wrap >
                  <router-link v-if='reply.user'  class='grey--text text--darken-1'  v-bind:to='{path:`/user/${reply.user}`}' title='Go to the player page' v-on:click.native='dataAnalysis(2301)'>
                    <div class='commentAvatar'>
                      <img v-bind:src="reply.avatar" class='commentAvatarSize'>
                    </div>
                  </router-link>
                  <div v-else class='commentAvatar'>
                    <img v-bind:src="reply.avatar" class='commentAvatarSize'>
                  </div>

                  <router-link v-if='reply.user' class='grey--text text--darken-1' v-bind:to='{path:`/user/${reply.user}`}' title='Go to the player page' v-on:click.native='dataAnalysis(2301)'>
                    <h4 class='mb-1 commentNickname' >{{reply.nickname}}</h4>
                  </router-link>
                  <h4 v-else class='mb-1 commentNickname'>{{reply.nickname}}</h4>

                  <span class='ml-2 grey--text text--darken-1' style='font-size:0.9em;line-height:40px;'>{{reply.moment}}</span>
                </v-layout>
                <p v-html="reply.article" class='mt-1'  v-bind:class="[{'grey--text text--lighten-2':reply.isDeleted }]"></p>
              </div>
            </div>
            <!-- 코멘츠 답글 끝 -->
          </div>

        </v-layout>
      <!--End, Comments Part-->

      </v-flex>
    </v-layout>

    <!-- Playing Games & Finished Matches -->
    <v-layout row wrap >
      <!-- 이미지 사진 -->
      <v-flex xs12 lg11 class='mt-5 ml-2 text-xs-left'  v-bind:class="[ {'mt-4 ml-4': $vuetify.breakpoint.mdAndUp}]" >
        <h3 class="hotGameTxt " >
          <v-icon >group_work</v-icon>
          Hot Teams
        </h3>
        <v-flex xs12 lg12 class='mt-2'>
          <v-layout  wrap  >
            <v-flex xs3 sm2 lg1 v-for='(team,idx) in teamIcons' v-bind:key='idx' >
              <router-link v-bind:to="`/group/${team.name}`" v-bind:title='`Go to ${team.fullName} page`' v-on:click.native='dataAnalysis(2401+idx)'>
                <img v-bind:src="`https://whitebetting.s3.amazonaws.com/allTeam/${team.id}.png`" v-bind:alt="`${team.fullName}`" v-bind:title="`${team.fullName}`" class='teamLogo'/>
              </router-link>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-flex>


      <v-flex class='mt-4 ml-2 text-xs-left' xs12 lg5 v-bind:class="[ {'ml-4 mt-5': $vuetify.breakpoint.lgAndUp}]"  >
        <h3 class="hotGameTxt " >
          <v-icon class='fa fa-soccer-ball-o'></v-icon>&nbsp;
          <router-link class='hotGameTxt hoverUnderline' v-bind:to='{path:`/list/inplayMatches`}' title='More in-play games' v-on:click.native='dataAnalysis(2500)'>
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
              <td class='betHistoryUser betGameOverUnder text-xs-left pl-2 ' >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='dataAnalysis(2501+props.index)'>
                  <span class='mr-2'>{{props.item.homeTeam}}</span>
                  <span class='blue--text text--darken-1'>{{props.item.goalsHomeTeam || 0 }}</span>
                  <span> : </span>
                  <span class='mr-2 blue--text text--darken-1'>{{props.item.goalsAwayTeam || 0}} </span>
                  <span>{{props.item.awayTeam}}</span>
                </router-link>
              </td>
              <td class="text-xs-center betNumber" ><router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='dataAnalysis(2501+props.index)'>{{ props.item.event_date_fromNow }}</router-link></td>
            </tr>
          </template>

        </v-data-table>
        <!--/ Player Rank -->

      </v-flex>
      <v-flex class='mt-4 ml-2 text-xs-left' xs12 lg5 v-bind:class="{'ml-5 mt-5': $vuetify.breakpoint.lgAndUp}"  >
        <h3 class="hotGameTxt ml-1">
          <v-icon class='far fa-calendar-alt'></v-icon>&nbsp;
          <router-link class='hotGameTxt hoverUnderline' v-bind:to='{path:`/list/finishedMatches`}' title='More closed games' v-on:click.native='dataAnalysis(2600)'>
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
              <td class='betHistoryUser betGameOverUnder text-xs-left pl-2 ' >
                <router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='dataAnalysis(2601+props.index)'>
                  <span class='mr-2'>{{props.item.homeTeam}}</span>
                  <span class='blue--text text--darken-1'>{{props.item.goalsHomeTeam}}</span>
                  <span> : </span>
                  <span class='mr-2 blue--text text--darken-1'>{{props.item.goalsAwayTeam}}</span>
                  <span>{{props.item.awayTeam}}</span>
                </router-link>
              </td>
              <td class=" text-xs-center betNumber" ><router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='dataAnalysis(2601+props.index)'>{{ props.item.event_date_fromNow }}</router-link>
              </td>
            </tr>
          </template>

        </v-data-table>
        <!--/ Lastest Bets -->
      </v-flex>

    </v-layout>


    <!-- 하단 info -->
    <v-layout row wrap v-bind:class="[ {'mt-5': $vuetify.breakpoint.mdAndUp}]"  >
      <v-flex class='mt-4 ml-2 text-xs-left' xs12 lg5 v-bind:class="[ {'ml-4': $vuetify.breakpoint.lgAndUp}]"  >
        <v-layout row wrap justify-space-between>
        <h3 class="hotGameTxt " >
          <v-icon >attach_money</v-icon>&nbsp;
          <router-link class='hotGameTxt hoverUnderline' v-bind:to='{path:`/group/userRank`}' title='More player rank list' v-on:click.native='dataAnalysis(2700)'>
          Player Rank
          </router-link>
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
              <td class='betHistoryUser text-xs-center' ><router-link class='linkColor' v-bind:to='{path:`/user/${props.item.user}`}' v-on:click.native='dataAnalysis(2701+props.index)'>{{ props.item.user }}</router-link></td>
              <td class="betHistoryBet text-xs-center" v-on:click.native='dataAnalysis(2701+props.index)' ><router-link class='linkColor' v-bind:to='{path:`/user/${props.item.user}`}'>{{ props.item.totalStake }}</router-link></td>
              <td class="betHistoryBet text-xs-center" v-on:click.native='dataAnalysis(2701+props.index)' ><router-link class='linkColor' v-bind:to='{path:`/user/${props.item.user}`}'>{{ props.item.totalReturn }}</router-link></td>
            </tr>
          </template>

        </v-data-table>
        <!--/ Player Rank -->

      </v-flex>
      <v-flex class='mt-4  ml-2 text-xs-left' xs12 lg5 v-bind:class="{'ml-5': $vuetify.breakpoint.lgAndUp}"  >
        <h3 class="hotGameTxt ml-1">
          <v-icon class='fab fa-ethereum'></v-icon>
          <router-link class='hotGameTxt hoverUnderline ml-1' v-bind:to='{path:`/group/lastestBets`}' title='More lastest bets list' v-on:click.native='dataAnalysis(2800)'>Latest Bets
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
              <td class='betHistoryUser' ><router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='dataAnalysis(2801+props.index)'>{{ props.item.user }}</router-link></td>
              <td class="betHistoryGame text-xs-center"><router-link class='linkColor' v-bind:to='{path:`/football/${props.item.fixture_id}`}' v-on:click.native='dataAnalysis(2801+props.index)'>{{ props.item.stake }}</router-link></td>
            </tr>
          </template>

        </v-data-table>
        <!--/ Lastest Bets -->
      </v-flex>

    </v-layout>

    <v-layout row wrap  >
      <v-flex xs12 lg9 >
        <h3 class="mt-4 mb-2 ml-2 hotGameTxt text-xs-left " v-bind:class="{'mt-4 ml-4': $vuetify.breakpoint.lgAndUp}"  >
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
import mixinComment from '@/commons/mixinComment';
import mixinDataAnal from '@/commons/mixinDataAnal';
const GameAPI = new gameAPI();
import util from '@/commons/util';
const Util    = new util();
import { mapState, mapActions, mapMutations } from 'vuex';
import Loading from '@/components/Loading'

export default {
  name : 'Main',
  mixins: [mixinComment, mixinDataAnal],
  components: { Loading },
  data () {
    return {
      isMobile : (window.innerWidth < 1264) ? true : false,
      teamIcons : GameData.mainPageTeamIcons,
      announcements: GameData.announcements,
      hotGameList : [],
      hotGameHeaders: GameData.gameHeader,

      inPlayGameList : [],
      comments       : [],
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
      loader :{ hotGameList : false, inPlayGameList : false, closedGameList : false, userRank: false, latestBetsList : false, commentsList : false, },
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
    //   window.open(`/football/${fixtureId}`);
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
        // inPlayGameList[idx].game = `${info.homeTeam} : ${info.awayTeam}`;
        inPlayGameList[idx].event_date_fromNow = this.$moment(info.event_date).fromNow();
      })
    this.inPlayGameList = inPlayGameList;
    this.loader.inPlayGameList = false;
    },
    async _getNewComments(){
      this.loader.commentsList = true;
      const newComments = await GameAPI.getNewComments();
      const comments = this._makeAvartar(newComments);
      comments.sort( (a,b)=> (a.notice==b.notice) ? 0: a.notice ? -1 : 1 ); 
      this.comments = comments;
      this.loader.commentsList = false;

    },
    async _getClosedGameListFuc(){ // get closed games list
      this.loader.closedGameList = true;
      const closedGameList = await GameAPI.getClosedGameList();
      closedGameList.map( (info, idx)=>{ // 여기서 부터 작업
        // closedGameList[idx].game = `${info.homeTeam} : ${info.awayTeam}`;
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
    this.dataAnalysis(20001);
    this.deleteHelloDom();    
    Util.checkSession(this.$session, this.userAccount); // session 체크
    window.scrollTo(0,0); // 항상 페이지 최상단으로

    this._getHotGameListFuc(); // get hot games list
    this._getInPlayGameListFuc(); // get in-play games list
    this._getNewComments(); // get new comments list
    this._getClosedGameListFuc(); // get closed games list
    this._getUserRankListFuc(); // get user rank
    this._getLatestBetsListFuc(); // get lastest bets list

  },
  beforeCreate(){ // 세션처리는 Toolbar에서 한다
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
/* .teamLogo{width:70px;max-height:90px; margin:10px auto;display:block;line-height:70px;} */
.teamLogo{width:50px;max-height:65px; margin:10px auto;display:block;line-height:70px;}
/* .teamIconGroup{background-color:#fafafa;border-radius:5px;} */

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

/* Comments */
.v-btn:not(.v-btn--depressed):not(.v-btn--flat){box-shadow: 0px 0;-webkit-box-shadow:0px 0 ;}
.commentNickname{font-size:1.1em;line-height:40px;max-width:120px;overflow:hidden; white-space: nowrap;}
.commentAvatar{margin-right:20px;width:40px;height:40px;border-radius:30px;overflow:hidden;}
.commentAvatarSize{transform:scale(1.5);width:40px;height:40px;border-radius:30px;overflow:hidden;}
.mainPcComments{max-height:420px;overflow:hidden;}
.mainMobileComments{max-height:220px;overflow:hidden;}

@media screen and (min-width:0px) and (max-width: 960px){
  .betGameInfo{max-width: 44px;}
  .betGameFromNow{min-width:50px;}
  .teamLogo{width:50px;max-height:70px; margin:10px auto;display:block;line-height:70px;}
  .gameGuide{padding-left:0px;}

  .betHistoryUser{ max-width: 80px;}

}
</style>

<style >
@media screen and (min-width:0px) and (max-width: 960px){
  table.v-table thead th {
    max-width:50px;
  }
  table.v-table thead td:not(:nth-child(1)), table.v-table tbody td:not(:nth-child(1)), table.v-table thead th:not(:nth-child(1)), table.v-table tbody th:not(:nth-child(1)), table.v-table thead td:first-child, table.v-table tbody td:first-child, table.v-table thead th:first-child, table.v-table tbody th:first-child {
    padding: 0!important;
  }
}
</style>