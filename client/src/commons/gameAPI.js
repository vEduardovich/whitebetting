import axios from 'axios';
import qs from 'qs'; 

class GameAPI{
  constructor (){
    // 개발서버에서만 10001 포트에 직접 접근한다
    this.baseURL = (process.env.NODE_ENV == 'development') ? 'http://localhost:10001' : '';
  }
  // btn log
  dataAnalysis(what){
    try {
      axios.get('/apis/data/pushData', {
        baseURL: this.baseURL,
        params: { what: what },
      });

    } catch (err) { console.log(err); reject(err); }
  }

  // 영수증 받기전 tx 확인
  async checkTx(userAccount, isMobile, fixtureId, fixtureObjId, selectedTeam, odd, stake, teamName, market, hash) {
      try {
        axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/football/checkTx',
          data: { 
            userAccount  : userAccount,
            isMobile     : isMobile,
            fixtureId    : fixtureId,
            fixtureObjId : fixtureObjId,
            selectedTeam : selectedTeam,
            odd          : odd,
            stake        : stake,
            teamName     : teamName,
            market       : market,
            hash         : hash,
          },
        });
      } catch (err) { console.log(err); reject(err); }
  }

  // getNewComments 가져오기
  async getNewComments() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get('/apis/main/getNewComments', {
          baseURL: this.baseURL,
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // getMoreComments 가져오기
  async getMoreComments(pageNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get('/apis/comment/more', {
          baseURL: this.baseURL,
          params: { pageNum: pageNum },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // countComments 가져오기
  async countComments() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get('/apis/comment/count', {
          baseURL: this.baseURL,
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }
  
  // getAllComments 가져오기
  async getAllComments(pageNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get('/apis/comment/all', {
          baseURL : this.baseURL,
          params  : { pageNum: pageNum },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // DeleteComment
  async deleteReply(commentId, reIdx, replyId) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/football/deleteReply',
          data: { commentId: commentId, reIdx: reIdx, replyId: replyId, },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // DeleteComment
  async deleteComment(commentId) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/football/deleteComment',
          data: { commentId: commentId, },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // replyVote
  async replyVote(what, isMobile, commentId, user, replyId) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/football/replyVote',
          data: { what: what, isMobile: isMobile, commentId: commentId, user: user, replyId: replyId },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // commentVote
  async commentVote(what, isMobile, commentId, user ) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/football/commentVote',
          data: { what: what, isMobile: isMobile, commentId: commentId, user: user },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // 코멘트를 가져온다
  async getComments(fixtureId, category) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/football/getComments',
          data: { fixtureId: fixtureId, category: category },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // 답글의 답글을 저장한다
  async reply2Comment(isMobile, replyId, textareaTxt, userAccount, avatarNum, mainCommentId, reIdx) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/football/reply2Comment',
          data: { isMobile: isMobile, replyId: replyId, textareaTxt: textareaTxt, userAccount: userAccount, avatarNum: avatarNum, mainCommentId: mainCommentId, reIdx: reIdx },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // 답글을 저장한다
  async replyComment(isMobile, replyId, textareaTxt, userAccount, avatarNum, mainCommentId) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/football/replyComment',
          data: { isMobile: isMobile, replyId: replyId, textareaTxt: textareaTxt, userAccount: userAccount, avatarNum: avatarNum, mainCommentId: mainCommentId },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // 코멘트를 저장한다
  async postComment(isMobile, fixtureId, fixtureObjId, category, textareaTxt, userAccount, avatarNum,){
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/football/postComment',
          data: { isMobile: isMobile, fixtureId: fixtureId, fixtureObjId: fixtureObjId, category: category, textareaTxt: textareaTxt, userAccount: userAccount, avatarNum: avatarNum, },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // guardian 기사들을 가져온다
  guardianInfo(query) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(query);
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // game stat을 가져온다
  getStatInfo(leagueId, homeTeamId, awayTeamId, fixtureId) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/football/getStatInfo',
          data: { leagueId: leagueId, homeTeamId: homeTeamId, awayTeamId: awayTeamId, fixtureId: fixtureId },
        });
        resolve(res.data);

      } catch (err) { reject(err); }
    })
  }
  // 유저 계정에 white를 저장한다.
  async getUserWhite(gotUserAccount) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/user/getUserWhite',
          data: { userAccount : gotUserAccount },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // 현재 남은 max pot을 구한다 + 베팅 전 Odd가 바뀌었는지 확인
  async getMaxPot(fixtureId, selectedTeam, stake, odd) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/football/getMaxPot',
          data: { fixtureId: fixtureId, selectedTeam: selectedTeam, stake: stake, odd : odd },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }
  // In-play & Finished Matches List
  async getMatchInfoList(page, ) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/list/getMatchInfoList',
          data: { page: page, },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // 리드 또는 팀의 남은 게임 목록을 가져오기
  async getGameList(page, pageNum ) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/list/getGameList',
          data: { page: page, pageNum: pageNum },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // get in-play games list
  async getInPlayGameList() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/main/getInPlayGame',
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // get closed games list
  async getClosedGameList() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/main/getClosedGame',
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }  

  // latest bets list 가져오기
  getLatestBetsList() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get('/apis/main/getLatestBetsList', {
          baseURL: this.baseURL,
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }

  // user Rank list 가져오기
  getUserRankList() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios( {
          baseURL: this.baseURL,
          method: 'post',
          url: '/apis/main/getUserRankList',      
          // data: { }    
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }  

  // hot game list 가져오기
  getHotGameList(){
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get('/apis/main/getHotGameList', {
          baseURL: this.baseURL,
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })    
  }

  // 유저 베팅 정보 가져오기
  getUserBetInfo(userAccount){
    return new Promise( async (resolve, reject) => {
      try {
        const res = await axios.get('/apis/user/getUserBetInfo', {
          baseURL: this.baseURL,
          params: { userAccount: userAccount },
        });
        resolve(res.data);

      } catch (err) { console.log(err);reject(err); }
    })
  }

  //게임정보 가져오기
  getGameInfo(fixtureId){
    return new Promise( async (resolve, reject)=>{
      try{
        const res = await axios.get('/apis/football/getGameInfo', {
          baseURL : this.baseURL,
          params : {fixtureId: fixtureId },
        });
        resolve(res.data);

      }catch(err){reject(err);}
    })
  }

  // 베팅 history 가져오기
  getBetHistory(fixtureId){
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get('/apis/football/getBetHistory', {
          baseURL: this.baseURL,
          params: { fixtureId: fixtureId},
        });
        resolve(res.data);

      } catch (err) { reject(err); }
    })

  }
  

  // 베팅 테스트!
  setBetInfoTest(transaction) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'post',
          baseURL: this.baseURL,
          url: '/apis/football/setBetInfoTest',
          data : {transaction: transaction},
        });
        resolve(res.data);
      } catch (err) { console.log(err); reject(err); }
    })
  }    

  // 베팅 후 게임정보 저장하기
  setBetInfo(userAccount, fixtureObjId, fixtureId, selectedTeam, teamName, stake, odd, market, hashTx){
    try{
      const data = {
        userAccount   : userAccount,
        fixtureObjId  : fixtureObjId,
        fixtureId     : fixtureId,
        selectedTeam  : selectedTeam,
        teamName      : teamName,
        stake         : stake,
        odd           : odd,
        market        : market,
        transaction   : hashTx,
      }
      axios( {
        method  : 'post',
        baseURL : this.baseURL,
        url     : '/apis/football/setBetInfo',
        data    : qs.stringify(data),
        // data    : data,
      }).then( (res)=>{
        console.log('성공');
      }).catch ( err => console.log('실패'));
    } catch(err){
      console.log('게임정보 저장 에러');
    }
  }
}

export default GameAPI;