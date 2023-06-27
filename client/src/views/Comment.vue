<template>
  <div class='broadcastPage'>
    <v-layout row wrap>
      <v-flex xs12 lg2>
        <img src='https://whitebetting.s3.amazonaws.com/game/logo/favicon.svg' class='mt-3' alt="wB" title="wB" width='100' height='62'/>
      </v-flex>
      <v-flex xs12 lg4>
        <h1 class='mt-1 grey--text text--darken-1' v-bind:class="{'mt-5 ml-4': $vuetify.breakpoint.lgAndUp}">Comments</h1>
      </v-flex>
    </v-layout>

    <v-layout column wrap class='mt-4 mx-1' v-bind:class="[{'mt-5 ml-4': $vuetify.breakpoint.lgAndUp }]">
      <!-- 코멘츠 -->
      <v-flex xs12 lg8 class='mt-3' v-bind:class="[{'pr-5': $vuetify.breakpoint.lgAndUp } ]" >
        <v-flex xs12 class='mt-1 mb-2 text-xs-left'>
          <v-layout row wrap justify-space-between>
            <h3 class="betHistoryTxt ml-1 " style='line-height:30px;' >
              <v-icon style='line-height:15px;font-size:22px;' class='grey--text text--darken-1 mr-1'>chat</v-icon>
              Comments
              <v-icon size=20 class='grey--text text--darken-1' v-on:click='_getComments();dataAnalysis(1322);'>refresh</v-icon>
            </h3>
            <v-btn dark color="blue darken-4" v-on:click="postComment(2)" class='commentPostBtn mr-0' v-bind:class="{'mr-3': $vuetify.breakpoint.xs}" title=' It doesn&#39;t need to sign in'>POST</v-btn>
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
            <div v-for="(comment, idx) in comments" v-bind:key='idx' class="py-2 pl-1 grey--text text--darken-2 newAppendedComment " v-bind:class="[{'pl-4': $vuetify.breakpoint.lgAndUp } ]">
              <div class="text-xs-left pt-2">
                <v-layout row wrap >
                  <router-link v-if='comment.user'  class='grey--text text--darken-1'  v-bind:to='{path:`/user/${comment.user}`}' title='Go to the player page'>
                    <div class='commentAvatar'>
                      <img v-bind:src="comment.avatar" class='commentAvatarSize'>
                    </div>
                  </router-link>
                  <div v-else class='commentAvatar'>
                    <img v-bind:src="comment.avatar" class='commentAvatarSize'>
                  </div>

                  <router-link v-if='comment.user' class='grey--text text--darken-1' v-bind:to='{path:`/user/${comment.user}`}' title='Go to the player page'>
                    <h4 class='mb-1 commentNickname' >{{comment.nickname}}</h4>
                  </router-link>
                  <h4 v-else class='mb-1 commentNickname'>{{comment.nickname}}</h4>
                  <span class='ml-2 grey--text text--darken-1' style='font-size:0.9em;line-height:40px;'>{{comment.moment}}</span>

                </v-layout>
                <p class='mt-2' v-if='comment.fixture_id'>
                  <router-link class='grey--text text--darken-1' v-bind:to='{path:`/football/${comment.fixture_id}`}' title='More hot games'>
                    <span>{{comment.fixture_Obj_id.homeTeam}}</span>
                    <span class='pink--text text--darken-2'>{{comment.fixture_Obj_id.odd.homeTeam}}</span>
                    <span class='ml-1'>Draw</span><span class='pink--text text--darken-2'>{{comment.fixture_Obj_id.odd.drawTeam}}</span>
                    <span class='ml-1'>{{comment.fixture_Obj_id.awayTeam}}</span>
                    <span class='pink--text text--darken-2'>{{comment.fixture_Obj_id.odd.awayTeam}}</span>
                  </router-link>
                </p>
                <p v-html="comment.article" class='mt-1' v-bind:class="[{'grey--text text--lighten-2':comment.isDeleted }]"></p>
                <v-layout row wrap justify-space-between >
                  <div class="text-xs-left">
                    <v-btn small fab class='commentBtn' title='Good' v-bind:disabled='comment.isDeleted' v-on:click='commentVote(1, idx) ' v-bind:loading="comment.score.upLoader"><v-icon>keyboard_arrow_up</v-icon></v-btn>
                    <span v-bind:class="[{'blue--text':comment.score.good.length>0 }]">{{comment.score.good.length}}</span>
                    <v-btn small fab class='commentBtn' title='Bad' v-bind:disabled='comment.isDeleted' v-on:click='commentVote(2, idx)' v-bind:loading="comment.score.downLoader"><v-icon>keyboard_arrow_down</v-icon></v-btn>
                    <span>{{comment.score.bad.length}}</span>
                  </div>
                  <div class='text-xs-right '>
                    <v-btn v-if='userAccount && userAccount == comment.user && !comment.isDeleted' fab small class=' commentBtn'  v-on:click='deleteComment(idx)' >
                      <v-icon >delete</v-icon>
                    </v-btn>
                    <v-btn fab small class=' commentBtn'  v-on:click='replyComment(idx)'  v-if='!comment.isDeleted' >
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
                <div class="text-xs-left pt-2 pl-4">
                  <v-layout row wrap >
                    <router-link v-if='reply.user'  class='grey--text text--darken-1'  v-bind:to='{path:`/user/${reply.user}`}' title='Go to the player page'>
                      <div class='commentAvatar'>
                        <img v-bind:src="reply.avatar" class='commentAvatarSize'>
                      </div>
                    </router-link>
                    <div v-else class='commentAvatar'>
                      <img v-bind:src="reply.avatar" class='commentAvatarSize'>
                    </div>

                    <router-link v-if='reply.user' class='grey--text text--darken-1' v-bind:to='{path:`/user/${reply.user}`}' title='Go to the player page'>
                      <h4 class='mb-1 commentNickname' >{{reply.nickname}}</h4>
                    </router-link>
                    <h4 v-else class='mb-1 commentNickname'>{{reply.nickname}}</h4>

                    <span class='ml-2 grey--text text--darken-1' style='font-size:0.9em;line-height:40px;'>{{reply.moment}}</span>
                  </v-layout>
                  <p v-html="reply.article" class='mt-1'  v-bind:class="[{'grey--text text--lighten-2':reply.isDeleted }]"></p>

                  <v-layout row wrap justify-space-between style='margin-top:-5px;'>
                    <div class="text-xs-left">
                      <v-btn small fab class='commentBtn' title='Good' v-on:click='replyVote(1, idx, reIdx, reply.replyId) ' v-bind:disabled='reply.isDeleted' v-bind:loading="reply.score.upLoader"><v-icon>keyboard_arrow_up</v-icon></v-btn>
                      <span v-bind:class="[{'blue--text':reply.score.good.length>0 }]">{{reply.score.good.length}}</span>
                      <v-btn small fab class='commentBtn' v-on:click='replyVote(2, idx, reIdx, reply.replyId)' v-bind:disabled='reply.isDeleted' v-bind:loading="reply.score.downLoader"><v-icon>keyboard_arrow_down</v-icon></v-btn>
                      <span>{{reply.score.bad.length}}</span>
                      <!-- <strong class='ml-1 ' v-bind:class="[{'blue--text':comment.score.total>0 }]">{{comment.score.total}}</strong> -->
                    </div>
                    <div class='text-xs-right '>
                      <v-btn v-if='userAccount && userAccount == reply.user && !reply.isDeleted' fab small class=' commentBtn'  title='Bad' v-on:click='deleteReply(idx, reIdx, reply.replyId)' >
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
              <!-- More results -->
              <div>
                <!-- <v-btn color='pink lighten-5' v-bind:loading="loader.more" class='mt-4 moreBtn text-capitalize pink--text text--accent-1' v-on:click='moreExe' v-show='comments.length < totalCount'> -->
                <v-btn color='pink lighten-5' v-bind:loading="loader.more" class='mt-4 moreBtn text-capitalize pink--text text--accent-1' v-on:click='moreExe' v-show='loader.moreBtn'>
                  <v-icon>expand_more</v-icon>More results
                </v-btn>
              </div>

          </v-layout>
        </v-flex>

      </v-flex>

    </v-layout>

		<!-- adding loading icon -->
		<Loading v-if='loadingStatus'/>

  </div>
</template>

<script>
import gameAPI from '@/commons/gameAPI';
import Loading from '@/components/Loading'
import mixinComment from '@/commons/mixinComment';
import util from '@/commons/util';
import { mapState, mapActions, mapMutations } from 'vuex';
import mixinDataAnal from '@/commons/mixinDataAnal';

const GameAPI  = new gameAPI();
const Util       = new util();

const isMobile = (window.innerWidth < 1264) ? true : false;
export default {
  name: 'Comment',
  mixins: [mixinComment, mixinDataAnal],
  components: { Loading },
  data () {
    return {
      isMobile : '',
      loader :{ more : false, moreBtn: false, },

      textareaTxt : '',
      comments : [],
      commentsCount : '',
      totalCount :'',
      pageNum : '',
    }
  },
  methods : {
		...mapActions([
			'changeLoadingStatus',
    ]),
    ...mapMutations ([
      'CHANGE_LOADING_STATUS',// 로딩화면 추가
    ]),

    async moreExe(){
      this.loader.more = true;
      this.pageNum++;
      // this.$router.push(`/hotcomments/${this.pageNum}`);//좋긴한데 back을 눌렀을때 안좋다.
      const moreComments = await GameAPI.getMoreComments(this.pageNum);
      const comments = this._makeAvartar(moreComments);
      this.comments = this.comments.concat(comments);
      this.commentsCount += comments.length;
      this._checkMoreBtn();
      this.loader.more = false;
    },
    _checkMoreBtn(){
      // moreBtn 보일지 말지
      if(this.comments.length < this.totalCount) this.loader.moreBtn = true;
      else this.loader.moreBtn = false;
    },

    async _getComments(){
      // console.log('모든 코멘트 가져오기');
      this.pageNum = +this.$route.params.pageNum || 1;

      this.changeLoadingStatus(true);

      const allComments = await GameAPI.getAllComments(this.pageNum);
      const comments = this._makeAvartar(allComments);
      // true일 경우 first로 올린다. false로 바꿀경우 1 : -1 로 바꾼다. 같은 true라면 최신글이 위로 올라간다
      comments.sort( (a,b)=> (a.notice==b.notice) ? 0: a.notice ? -1 : 1 );
      let commentsCount = comments.length;
      comments.map( comment => {
        commentsCount += comment.sub_comment_arr.length;
      })
      this.comments = comments;
      this.commentsCount = commentsCount;
      this._checkMoreBtn();
      // console.log('this.commentsCount: '+ this.commentsCount);

      this.changeLoadingStatus(false);

    },
    // 모든 코멘트 카운트 가져오기. 더보기 버튼 때문에
    async _getTotalCommentCounts(){
      const totalCount = await GameAPI.countComments();
      this.totalCount = totalCount;
      // console.log(totalCount);
    }
  },
  async created(){
    this.dataAnalysis(20004);
    this.deleteHelloDom();    
    Util.checkSession(this.$session, this.userAccount); // session 체크
    window.scrollTo(0,0); // 항상 페이지 최상단으로

    this._getTotalCommentCounts();
    this._getComments();// 모든 코멘트 가져오기
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

<style scoped>
.broadcastPage{max-width: 850px;}
.dateFont{font-size:0.9em;}
.imgBox{max-width:80%;height:auto;box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);}

.v-btn:not(.v-btn--depressed):not(.v-btn--flat){box-shadow: 0px 0;-webkit-box-shadow:0px 0 ;}
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

/* More results */
.moreBtn{text-decoration: none; display:block;width:100%;height:36px; margin:0px auto;margin-bottom:20px;text-decoration: none;}

@media screen and (min-width:0px) and (max-width: 960px){
  .imgBox{max-width:100%;}
}
</style>

