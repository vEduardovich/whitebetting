// mixin 20.02.03
// common method for vote fuction

import gameAPI from '@/commons/gameAPI';
import GameData from '@/commons/gameData';
import util from '@/commons/util';
const GameAPI = new gameAPI();
const Util = new util();
const isMobile = (window.innerWidth < 1264) ? true : false;

const mixinComment = {
  methods: {
    replyComment2(idx, reIdx) {// 부모 idx와 자식 reIdx

      this.comments[idx].sub_comment_arr.map((c, i) => {
        if (i == reIdx) { c.isWritingReply = !c.isWritingReply; }
        else c.isWritingReply = false;// 다른 답글 버튼을 눌렀다면 다른 모든 답글창 닫기
      });// 자식 답글창 모두 닫고
      this.comments[idx].sub_comment_arr[reIdx].isWritingReply
      this.comments.map((c, i) => {
        c.isWritingReply = false;// 다른 답글 버튼을 눌렀다면 다른 모든 답글창 닫기
      });// 부모 답글창 모두 닫는다
    },    
    replyComment(idx) {
      this.comments.map((c, i) => {
        if (i == idx) c.isWritingReply = !c.isWritingReply;
        else c.isWritingReply = false;
      });// 부모 답글창 모두 닫고
      if (this.comments[idx].sub_comment_arr) {
        this.comments[idx].sub_comment_arr.map((c, i) => {
          c.isWritingReply = false;
        });// 자식 답글창 모두 닫는다
      }
    },   
    
    // 답글의 답글 저장하기
    async postReply2(idx, reIdx, replyId, mainCommentId, toNickname) { //부모 idx, 자식 replyId
      const replyText = this.comments[idx].sub_comment_arr[reIdx].replyText;
      if (!replyText) return;
      this.loader.replyTextarea = true;
      try {
        const avatarInfo = await this.getAvatarInfo(this.userAccount);
        const toReply = `<b>To ${toNickname}</b> `.concat(replyText);
        const replyId = Util.uid(24);

        // DB에 저장
        const commentId = await GameAPI.reply2Comment(isMobile, replyId, toReply, this.userAccount, avatarInfo.avatarNum, mainCommentId, reIdx);// 답글의 답글은 받아올 _id가 없으므로 그냥 서버로 던지면 된다
        avatarInfo.moment = this.$moment(Date.now()).fromNow();
        const replyPreObj =
        {
          category: 1,// 1은 게임게시판
          replyId: replyId,
          moment: this.$moment(Date.now()).fromNow(),
          article: toReply,// 코멘트 글
          main_comment_id: mainCommentId,
          count: 0,// 조회수. 나중을 위해 넣어놓는다
          score: { good: [], upLoader: false, bad: [], downLoader: false, },
          isWritingReply: false,
          replyText: '',
          loading: false,
        };
        const commentObj = { ...avatarInfo, ...replyPreObj };
        // console.log(commentObj);
        this.comments[idx].sub_comment_arr[reIdx].replyText = '';
        this.comments[idx].sub_comment_arr[reIdx].isWritingReply = false,
          this.loader.replyTextarea = false;
        this.commentsCount++;

        // console.log('답글의 답글');
        if (this.comments[idx].sub_comment_arr) {
          this.comments[idx].sub_comment_arr.splice(reIdx + 1, 0, commentObj);
        } else {
          this.comments[idx].sub_comment_arr = new Array;
          this.comments[idx].sub_comment_arr.push(commentObj);
        };

      } catch (err) { console.log(err); }
      this.loader.replyTextarea = false;
    },    
    // 답글 저장하기. 모든 답글은 배열안에 들어간다. 따라서 고유의 uid를 가지고 있어야 한다
    async postReply(idx, mainCommentId, toNickname, event) {//idx에는 답글의 배열 index가 들어있다.
      const lastDom = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.lastChild;
      // 새로운 dom이 추가되기 전 마지막 dom이 lastDom 이다. 따라서 약간의 조작이 필요하다
      try {
        // 아래의 length는 새로운 dom이 추가되기전 length이므로 3개가 넘을 때 스크롤 시키고 싶다면 2를 넣는다
        if (this.comments[idx].sub_comment_arr.length > 2) {
          window.scrollTo(0, lastDom.offsetTop - 100);
        }
      } catch (err) { }
      const replyText = this.comments[idx].replyText;// 글 내용을 가져온다
      if (!replyText) return;

      this.loader.replyTextarea = true;

      const avatarInfo = await this.getAvatarInfo(this.userAccount);
      avatarInfo.moment = this.$moment(Date.now()).fromNow();
      const replyId = Util.uid(24);// 답글

      try {
        const commentId = await GameAPI.replyComment(isMobile, replyId, replyText, this.userAccount, avatarInfo.avatarNum, mainCommentId);

        const replyPreObj =
        {
          _id: commentId,
          category: 1,
          moment: this.$moment(Date.now()).fromNow(),
          replyId: replyId,
          article: replyText,// 코멘트 글
          main_comment_id: mainCommentId,
          count: 0,// 조회수. 나중을 위해 넣어놓는다
          score: { good: [], upLoader: false, bad: [], downLoader: false, },
          isWritingReply: false,
          replyText: '',
          new: true,
        };
        const commentObj = { ...avatarInfo, ...replyPreObj };
        // console.log(commentObj);
        this.comments[idx].replyText = '';
        this.comments[idx].isWritingReply = false,
          this.loader.replyTextarea = false;
        this.commentsCount++;

        if (this.comments[idx].sub_comment_arr) {
          this.comments[idx].sub_comment_arr.push(commentObj);
        } else {
          this.comments[idx].sub_comment_arr = new Array;
          this.comments[idx].sub_comment_arr.push(commentObj)
        };

        // 새로 추가된 betHistory 의 색을 2초간 분홍색으로 칠했다가 돌려놓기
        // 답글의 요소를 가져오는 건 잘못하겠다. 집에서 고민을 해보자.
        // const tempEl = document.querySelectorAll('.newAppendedReply');
        // const a = tempEl[tempEl.length-1];
        // if(a) {
        //   console.log('a');
        //   console.log(a);
        //   a.style.backgroundColor = '#f7c8d8';
        //   a.style.borderRadius = '8px';
        //   setTimeout(() => {
        //     a.style.backgroundColor = '#F1F1F1';
        //   }, 3000);
        // }

      } catch (err) { console.log(err); }
      this.loader.replyTextarea = false;

    },


    async postComment(category) { // 1은 게임게시판, 2는 일반게시판
      if (!this.textareaTxt) return;
      this.loader.commentTextarea = true;
      try {
        const avatarInfo = await this.getAvatarInfo(this.userAccount);
        let fixtureId = '';
        let gameInfoId = '';
        if (category == 1){// 게임게시판일 경우 경기정보를 넣어준다
          fixtureId = this.gameInfo.fixture_id;
          gameInfoId = this.gameInfo._id;
        }

        // DB에 저장
        const commentId = await GameAPI.postComment(isMobile, fixtureId, gameInfoId, category, this.textareaTxt, this.userAccount, avatarInfo.avatarNum);
        // console.log('commentId :'+ commentId);
        // 클라에서 보여주기
        const commentPreObj = {
          // user      : '',// userAccount가 없다면 undefined
          _id: commentId,
          category: category, // 1
          moment: this.$moment(Date.now()).fromNow(),
          article: this.textareaTxt,
          score: { good: [], upLoader: false, bad: [], downLoader: false, },
          isWritingReply: false,
          replyText: '',
        };

        const commentObj = { ...avatarInfo, ...commentPreObj };
        this.textareaTxt = ''
        this.loader.commentTextarea = false;
        this.commentsCount++;

        // 새로 추가된 betHistory 의 색을 2초간 분홍색으로 칠했다가 돌려놓기
        const a = document.querySelector('.newAppendedComment');
        let newDom;
        if (category == 1) {// 게임 게시판, 공지사항때문에
          this.comments.splice(1, 0, commentObj);          
          newDom = a.parentNode.children[1];
        } else{// 일반게시판
          this.comments.unshift(commentObj);          
          newDom = a.parentNode.children[0];
        }

        if (newDom) {
          
          newDom.style.backgroundColor = '#f7c8d8';
          newDom.style.borderRadius = '8px';
          setTimeout(() => {
            newDom.style.backgroundColor = '#FAFAFA';
          }, 1500);
        }

      } catch (err) {
        console.log(err);
      }
    },    
    // user이름과 avatar 정보 만들기.
    getAvatarInfo(account, num) {
      const avatarInfo = { user: '', avatar: '', };
      if (account) {
        avatarInfo.nickname = account.slice(0, 12);
        avatarInfo.user = account;
        avatarInfo.avatar = `https://whitebetting.s3-us-west-1.amazonaws.com/game/avatar/theLawsOfPower.png`;
      } else {
        // 만약 num이 없다면 랜덤하게 하나 만든다
        const avatarNum = num ? num : Util.randRange(0, 27);
        avatarInfo.nickname = GameData.fakeUser[avatarNum].slice(0, 12);
        avatarInfo.avatar = `https://whitebetting.s3-us-west-1.amazonaws.com/game/avatar/${avatarNum + 1}.png`;
        avatarInfo.avatarNum = avatarNum;
      }
      return avatarInfo;
    },      
    async commentVote(what, idx) {
      try {
        // upLoader, dowLoader는 로딩바 관리용
        if (what == 1) { this.comments[idx].score.upLoader = true; }
        else { this.comments[idx].score.downLoader = true; }

        await GameAPI.commentVote(what, isMobile, this.comments[idx]._id, this.userAccount);
        const newVoteObj = { user: this.userAccount, createdAt: Date.now() };
        if (what == 1) {// if upVote
          this.comments[idx].score.good.push(newVoteObj);
          this.comments[idx].score.upLoader = false;
        } else {// if downVote
          this.comments[idx].score.bad.push(newVoteObj);
          this.comments[idx].score.downLoader = false;
        }
      } catch (err) { console.log(err); }
    },
    async replyVote(what, idx, reIdx, replyId) {
      try {
        // upLoader, dowLoader는 로딩바 관리용
        if (what == 1) { this.comments[idx].sub_comment_arr[reIdx].score.upLoader = true; }
        else { this.comments[idx].sub_comment_arr[reIdx].score.downLoader = true; }

        await GameAPI.replyVote(what, isMobile, this.comments[idx]._id, this.userAccount, replyId);
        const newVoteObj = { user: this.userAccount, createdAt: Date.now() };
        if (what == 1) {// if upVote
          this.comments[idx].sub_comment_arr[reIdx].score.good.push(newVoteObj);
          this.comments[idx].sub_comment_arr[reIdx].score.upLoader = false;
          // this.comments[idx].score.total += 1;//일단 total열외
        } else {// if downVote
          this.comments[idx].sub_comment_arr[reIdx].score.bad.push(newVoteObj);
          this.comments[idx].sub_comment_arr[reIdx].score.downLoader = false;
          // this.comments[idx].score.total -= 1;
        }
      } catch (err) { console.log(err); }
    },    
    async deleteReply(idx, reIdx, replyId) {//idx는 덧글의 인덱스, reIdx는 답글의 인덱스
      try {
        GameAPI.deleteReply(this.comments[idx]._id, reIdx, replyId);
        this.comments[idx].sub_comment_arr[reIdx].article = 'This was deleted by commenter';
        this.comments[idx].sub_comment_arr[reIdx].isDeleted = true;
      } catch (err) { console.log(err); console.log('It was able not to delete.'); }
    },

    async deleteComment(idx) {
      try {
        GameAPI.deleteComment(this.comments[idx]._id);
        this.comments[idx].article = 'This was deleted by commenter';
        this.comments[idx].isDeleted = true;
      } catch (err) { console.log(err); console.log('It was able not to delete.'); }
    },    
    
    _makeAvartar(comments) {
      comments.map(comment => {
        const avatarInfo = this.getAvatarInfo(comment.user, comment.avatar_num);
        comment.nickname = avatarInfo.nickname;
        comment.avatar = avatarInfo.avatar;
        comment.moment = this.$moment(comment.createdAt).fromNow();
        comment.score.upLoader = false;
        comment.score.downLoader = false;
        comment.isWritingReply = false;
        comment.replyText = '';
        if (comment.fixture_Obj_id){
          comment.gameText =
            `${comment.fixture_Obj_id.homeTeam} ${comment.fixture_Obj_id.odd.homeTeam} v${comment.fixture_Obj_id.odd.drawTeam} ${comment.fixture_Obj_id.awayTeam} ${comment.fixture_Obj_id.odd.awayTeam}`;
        }
        this.commentsCount += comment.sub_comment_arr.length;
        comment.sub_comment_arr.map(reply => {
          const avatarInfo = this.getAvatarInfo(reply.user, reply.avatar_num);
          reply.nickname = avatarInfo.nickname;
          reply.avatar = avatarInfo.avatar;
          reply.moment = this.$moment(reply.createdAt).fromNow();
          reply.score.upLoader = false;
          reply.score.downLoader = false;
          reply.isWritingReply = false;
          reply.replyText = '';
        })
      })
      return comments;
    },      
  },
  
}

export default mixinComment;
