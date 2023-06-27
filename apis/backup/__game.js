const express        = require('express');
const get_ip         = require('ipware')().get_ip;
const route          = express.Router();
// const fs          = require('fs');
const request        = require('request-promise');
const nodemailer     = require('nodemailer');

const config         = require('../../commons/config');
const utils          = require('../../commons/utils.js');

const DB_gameInfo    = require('../../models/gameInfo'); // 게임 정보
const DB_betInfo     = require('../../models/betInfo'); // 베팅 정보
const DB_userAccount = require('../../models/userAccount');
const DB_dummy       = require('../../models/dummy'); // 베팅 정보
const DB_standings   = require('../../models/standings');// 순위정보
const DB_comment     = require('../../models/comment');// 순위정보

const Web3           = require('web3');
const transporter    = nodemailer.createTransport( config.mail.transporter );
const paidUser       = config.mail.paidUser; // 새로 가입한 회원


function _makeNewComment(req, isMobile, replyId, textareaTxt, userAccount, avatarNum, mainCommentId){
  const ipAddress = get_ip(req).clientIp;
  const newComment = {
    createdAt       : Date.now(),
    isMobile        : isMobile,
    category        : 1,// 게임 게시판
    replyId         : replyId,// 고유답글id
    article         : textareaTxt,
    user            : userAccount,
    avatar_num      : avatarNum,
    main_comment_id : mainCommentId,// 부모글의 id
    ip_address      : ipAddress,
    isDeleted       : false,
    count           : 0,
    score           : { good: [], bad: [] },
  };
  return newComment;
}

async function _saveNewComment(userAccount, mainCommentId, newComment, reIdx){
  if (userAccount) {//로그인한 유저라면
    try {
      const selectRank = { _id: 1 };
      const fo = { user: userAccount };
      const user_Obj = await DB_userAccount.findOne(fo).select(selectRank).exec();
      // newComment.nickname // 현재 닉네임은 저장하지 않는다
      newComment.user_Obj_id = user_Obj._id;
    } catch (err) { console.log(err); }
  };
  try {
    const fo = { _id: mainCommentId }
    const selectRank = { sub_comment_arr: 1 };
    const appendedReply = await DB_comment.findOne(fo).select(selectRank).exec();
    if (reIdx != undefined) appendedReply.sub_comment_arr.splice(reIdx + 1, 0, newComment);//답글의 답글이라면
    else appendedReply.sub_comment_arr.push(newComment);//답글이라면 맨끝에 추가

    appendedReply.markModified('sub_comment_arr');
    appendedReply.save();
    return appendedReply._id;
  } catch (err) { console.log(err); return;}
}

// 답글의 답글쓰기
route.post('/reply2Comment', async (req, res) => {
  const { isMobile, replyId, textareaTxt, userAccount, avatarNum, mainCommentId, reIdx } = req.body;
  const newComment = _makeNewComment(req, isMobile, replyId, textareaTxt, userAccount, avatarNum, mainCommentId);
  const appendedReplyId = await _saveNewComment(userAccount, mainCommentId, newComment, reIdx);
  res.json(appendedReplyId);
})

// 답글 쓰기
route.post('/replyComment', async (req, res) => {
  // mainCommentId 는 해당 글이 어느 글의 배열안에 있는지 확인하기 위해서다.
  // 즉 같은 mainCommentId 를 가지고 있다면 해당 mainCommentId 의 같은 배열안에 들어있다는 뜻이다.
  const { isMobile, replyId, textareaTxt, userAccount, avatarNum, mainCommentId } = req.body;
  const newComment = _makeNewComment(req, isMobile, replyId, textareaTxt, userAccount, avatarNum, mainCommentId);
  const appendedReplyId = await _saveNewComment(userAccount, mainCommentId, newComment);
  res.json(appendedReplyId);
})

// deleteReply
route.post('/deleteReply', async (req, res) => {
  const { commentId, reIdx, replyId } = req.body;
  // const ipAddress = get_ip(req).clientIp;
  // console.log('deleteReply: ' + commentId, reIdx, replyId);
  try {
    const reply = await DB_comment.findById(commentId).select({ sub_comment_arr : 1 });
    const replyIdx = reply.sub_comment_arr.findIndex(el => el.replyId == replyId); // 유저당
    if (replyIdx > -1) {
      reply.sub_comment_arr[replyIdx].ex_article = reply.sub_comment_arr[replyIdx].article;
      reply.sub_comment_arr[replyIdx].article = 'This was deleted by commenter';
      reply.sub_comment_arr[replyIdx].isDeleted = true;
      reply.markModified('sub_comment_arr');
    }
    reply.save();
    // console.log(reply);
    res.status(200).send(true);
  } catch (err) {
    console.log(err);
    res.status(200).send(false);
  }
})

// DeleteComment
route.post('/deleteComment', async (req, res) => {
  const { commentId } = req.body;
  try {
    // const comment = await DB_comment.findOneAndUpdate(f, { isDeleted : true }).select({ score: 1 });
    const comment = await DB_comment.findById(commentId).select({ article: 1, isDeleted: 1, ex_article: 1, });
    comment.ex_article = comment.article;
    comment.article    = 'This was deleted by commenter';
    comment.isDeleted  = true;
    comment.save();
    res.status(200).send(true);
  } catch(err){
    console.log(err);
    res.status(200).send(false);
  }
})

// replyVote!
route.post('/replyVote', async (req, res) => {
  const { what, isMobile, commentId, user, replyId } = req.body;
  const ipAddress = get_ip(req).clientIp;
  // const f = { _id: commentId, sub_comment_arr: { $elemMatch: { replyId: replyId } } };
  try {
    const reply = await DB_comment.findById(commentId).select({ sub_comment_arr: 1 });
    const replyIdx = reply.sub_comment_arr.findIndex(el => el.replyId == replyId); // 유저당
    const tempObj = { isMobile: isMobile, user: user, createdAt: Date.now(), ip_address: ipAddress };
    if (replyIdx > -1){
      if (what == 1) {// 만약 upVote라면
        reply.sub_comment_arr[replyIdx].score.good.push(tempObj);
        reply.markModified('sub_comment_arr');
      } else {// 만약 downVote라면
        reply.sub_comment_arr[replyIdx].score.bad.push(tempObj);
        reply.markModified('sub_comment_arr');
      }
    }
  reply.save();

  } catch (err) { console.log(err); }
  res.status(200).end();

})

// commentVote!
route.post('/commentVote', async (req, res) => {
  const { what, isMobile, commentId, user } = req.body;
  const ipAddress = get_ip(req).clientIp;
  try {
    const comment = await DB_comment.findById(commentId ).select({score: 1 });
    const tempObj = { isMobile: isMobile, user: user, createdAt: Date.now(), ip_address: ipAddress  };
    if( what == 1 ){// 만약 upVote라면
      comment.score.good.push(tempObj);
      comment.markModified('score.good');
    } else {// 만약 downVote라면
      comment.score.bad.push(tempObj);
      comment.markModified('score.bad');
    }
    comment.save();

  } catch (err) { console.log(err); }
  res.status(200).end();

})


// comment 읽어오기
route.post('/getComments', async (req, res) => {
  const { fixtureId , category} = req.body;  
  
  try{
    if (category == 1 || category == 2){// 만약 게임내 게시판이라면
      // const fo = { fixture_id: fixtureId, isDeleted: false, };
      const fo = { fixture_id: fixtureId};
      const s = { createdAt: -1 };
      const select = { createdAt: 1, category: 1, sub_comment_arr: 1, user: 1, avatar_num: 1, article: 1, count: 1, score: 1, user_Obj_id: 1, isDeleted: 1, notice: 1 };  
      const comments = await DB_comment.find(fo).sort(s).select(select).lean().populate('user_Obj_id', '  stat.white').exec();//이렇게 user의 white도 보내준다. 클라에서 user_Obj_id.stat.white 들어가면 된다.
      res.json(comments);
    }
  } catch(err){ console.log(err);}
})


// comment 쓰기
route.post('/postComment', async (req, res) => {
  const { isMobile, fixtureId, fixtureObjId, category, textareaTxt, userAccount, avatarNum } = req.body;
  const ipAddress = get_ip(req).clientIp;
  console.log('isMobile, fixtureId, fixtureObjId, category, textareaTxt, userAccount, avatarNum');
  console.log(isMobile, fixtureId, fixtureObjId, category, textareaTxt, userAccount, avatarNum);
  const newComment = {
    createdAt   : Date.now(),
    user        : userAccount,
    ip_address  : ipAddress,
    isMobile    : isMobile,
    category    : category,
    avatar_num  : avatarNum,
    isDeleted   : false,
    article     : textareaTxt,
    count       : 0,
    score       : new Object(),
    sub_comment_arr : [],
  };
  if (fixtureId){
    newComment.fixture_id = fixtureId;
    newComment.fixture_Obj_id = fixtureObjId;
  }
  if (userAccount) {//로그인한 유저라면
    try {
      const fo = { user: userAccount };
      const selectRank = { _id: 1 };
      const user_Obj = await DB_userAccount.findOne(fo).select(selectRank).exec();
      // newComment.nickname // 현재 닉네임은 저장하지 않는다
      newComment.user_Obj_id = user_Obj._id;
    } catch (err) { console.log(err); }
  };  
  try{
    // console.log(newComment);
    const appendedComment = await new DB_comment(newComment).save();
    res.json(appendedComment._id);
  } catch(err){ console.log(err);}
  
  res.status(200).end();
})

// 게임 stat과 prediction을 가져온다
route.post('/getStatInfo', async (req, res) => {
  // 쿠키값이나 queryString으로 들어온 hashKey를 서버에 보낼 수 있다.
  const { leagueId, homeTeamId, awayTeamId, fixtureId } = req.body;

  const fixtureTeams = new Array();

  const fo = { league_id: leagueId };
  const selectRank = { rankArr: 1, _id: 0 };
  const rank = await DB_standings.find(fo).select(selectRank).exec();
  // 한번에 homeTeamId와 awayTeamId에 일치하는 배열의 데이터만 가져오는 건 아직 못만들겠다. 19.12.13
  // 그래서 하나만 찾아온 후 그것을 배열에 push해서 클라로 날리는 방법을 사용한다.
  // ★ mongodb array에서 원하는 배열 요소만 찾아 넘기기. 그래도 이걸로 한단계 올라갔다.

  // 구조를 보니 챔스나 유로파같은 토너먼트는 받아오는 구조가 리그와 다르다. 그에 맞게 처리해야한다.
  if (leagueId == 530 || leagueId == 514 || leagueId == 403 || leagueId == 973) {// 토너먼트라면, 구조가 달라 따로 만든다
    console.log('토너먼트');
    if (rank[0]) {
      const fo = { league_id: leagueId };
      const selectRank = { rankArr: 1, _id: 0 };
      const rank = await DB_standings.find(fo).select(selectRank).exec();
      const rankInfo = rank[0].rankArr;
      rankInfo.map((all, idx) => {
        const homeTeamIndex = all.findIndex(el => el.team_id == homeTeamId);
        const awayTeamIndex = all.findIndex(el => el.team_id == awayTeamId);
        if (homeTeamIndex != -1) {
          fixtureTeams.push(all[homeTeamIndex]);
        }
        if (awayTeamIndex != -1) fixtureTeams.push(all[awayTeamIndex]);
      })
      console.log(fixtureTeams);
      res.json(fixtureTeams);
    } else { res.status(200).end(); }

  } else {// 리그경기라면
    // await makeFixtureRank(homeTeamId);
    // await makeFixtureRank(awayTeamId);
    try {
      console.log('리그경기');
      if (rank[0]) {
        const rankInfo = rank[0].rankArr;
        rankInfo.map((all, idx) => {
          // console.log(all);
          const homeTeamIndex = all.findIndex(el => el.team_id == homeTeamId);
          const awayTeamIndex = all.findIndex(el => el.team_id == awayTeamId);
          if (homeTeamIndex != -1) {
            fixtureTeams.push(all[homeTeamIndex]);
            // 아래와 같이 필요한 정보들만 추려서 전달한다
            // fixtureTeams.push({ rank: all[homeTeamIndex].rank, all: { win: all[homeTeamIndex].all.win, draw: all[homeTeamIndex].all.draw, lose: all[homeTeamIndex].all.lose }, forme: all[homeTeamIndex].forme });
          }
          if (awayTeamIndex != -1) {
            // fixtureTeams.push(all[awayTeamIndex])
            fixtureTeams.push({ rank: all[awayTeamIndex].rank, all: { win: all[awayTeamIndex].all.win, draw: all[awayTeamIndex].all.draw, lose: all[awayTeamIndex].all.lose }, forme: all[awayTeamIndex].forme });
          };
        })
        // 0자리에 homeTeam, 1자리에 awayTeam 으로 집어넣는다
        res.json(fixtureTeams)
      } else { res.status(200).end(); }

    } catch (err) { console.log(err); res.status(200).end(); }

  }
  async function makeFixtureRank(teamId) {
    const fo = { $and: [{ league_id: leagueId }, { rankArr: { $elemMatch: { team_id: teamId } } }] };
    const rankInfo = await DB_standings.find(fo).select({ 'rankArr.$': 1 }).exec();
    fixtureTeams.push(rankInfo[0].rankArr[0]);
  }



})

route.post('/getMaxPot', async (req, res)=>{
  async function _getCABalance(){ // contract 잔액 가져오기
    const web3 = new Web3(config.contract.serverAddress); // Infra 서버주소를 넣는다.
    const contractInfo = { abi: config.contract.abi, address : config.contract.address } // contract 정보 가져오기
    const wbContract = new web3.eth.Contract(contractInfo.abi, contractInfo.address);
    const caBalance = await wbContract.methods.getBalance().call();
    const contractPot = await web3.utils.fromWei(caBalance, 'ether'); // wei to ether

    // const isReal = await web3.eth.getTransactionReceipt("0x5e9a02399dfc362cef747c075a76fb8521054a8e0951f854bdcb7547ae3da547");
    // console.log('isReal.status');
    // console.log(isReal.status);
    // console.log(isReal.status == true );
    // console.log(isReal.status == "true");

    return contractPot;
  };
  function _makeMaxPot(mp, bet){
    const addValue = (bet.stake * 1000000 * bet.odd);
    switch (bet.selectedTeam){
      // finalResult & double chance
      case 1 : //console.log('homeTeam');
        mp.homeOver  += addValue;
        mp.homeUnder += addValue;
        break;
      case 2 : //console.log('drawTeam');
        mp.drawOver  += addValue;
        mp.drawUnder += addValue;
        break;
      case 3 : //console.log('awayTeam');
        mp.awayOver  += addValue;
        mp.awayUnder += addValue;
        break;
      case 6 : //console.log('homeTeamAndDraw');
        mp.homeOver  += addValue;
        mp.homeUnder += addValue;
        mp.drawOver  += addValue;
        mp.drawUnder += addValue;
        break;
      case 7 : //console.log('homeAndAwayTeam');
        mp.homeOver  += addValue;
        mp.homeUnder += addValue;
        mp.awayOver  += addValue;
        mp.awayUnder += addValue;
        break;
      case 8 : //console.log('awayTeamAndDraw');
        mp.drawOver  += addValue;
        mp.drawUnder += addValue;
        mp.awayOver  += addValue;
        mp.awayUnder += addValue;
        break;
      // over & under
      case 4 : //console.log('over');
        mp.homeOver  = mp.homeOver + addValue;
        mp.drawOver  = mp.homeOver + addValue;
        mp.awayOver  = mp.awayOver + addValue;
        break;
      case 5 : //console.log('under');
        mp.homeUnder = mp.homeUnder + addValue;
        mp.drawUnder = mp.drawUnder + addValue;
        mp.awayUnder = mp.awayUnder + addValue;
        break;
    }
  }

  const contractPot = await _getCABalance(); // contract 잔액 가져오기
  const { fixtureId, selectedTeam, stake } = req.body;
  const odd = parseFloat(req.body.odd);
  // https://stackoverflow.com/questions/15818789/mongoose-query-with-undefined
  // returnEth가 undefined 인 doc만 찾아온다. 관련 쿼리는 많다.
  // const betInfo = await DB_betInfo.find(fo).exists('returnEth').exec();// returnEth값이 있는 것들만 가져온다
  // Problem.find().ne('tutorialNumber', null).exec(callback);
  const fo      = { returnEth : { $exists: false } }; // returnEth라는 필드자체가 없는것만 찾아온다.
  const selectUser = { selectedTeam: 1, stake: 1, odd: 1 };
  const betInfo = await DB_betInfo.find(fo).select(selectUser).exec();// returnEth값이 있는 것들만 가져온다

  // 1: homeTeam, 2: drawTeam, 3: awayTeam, 4: over, 5: under, 6:homeTeamAndDraw, 7: homeAndAwayTeam, 8: awayTeamAndDraw
  // 최대 베팅 가능금액 계산
  const mp = { homeOver : 0, homeUnder : 0, drawOver : 0, drawUnder : 0, awayOver : 0, awayUnder : 0 };
  // let totalStake = 0;
  betInfo.map( bet =>{
    // 실수계산이 꼬이기 때문에 1,000,000을 곱해서 계산한 다음 최종값에 다시 나눠 결과를 뽑는다.
    // totalStake += bet.stake * 1000000;
    _makeMaxPot(mp, bet);
  })
  // console.log(selectedTeam, stake, odd);
  _makeMaxPot(mp, { selectedTeam: selectedTeam, stake : stake, odd : odd }); // 이제 추가할 베팅이 가능한지 확인

  // console.log(mp);
  const maxReturnEth = Math.max(mp.homeOver, mp.homeUnder, mp.drawOver, mp.drawUnder, mp.awayOver, mp.awayUnder);
  // console.log('maxReturnEth: ' + maxReturnEth);
  const checkMaxPot = ((contractPot * 1000000) - maxReturnEth) / 1000000; // contract pot - maxReturnEth
  // console.log('checkMaxPot: ' + checkMaxPot);
  const maxPotCheck = checkMaxPot > 1; // 아무리 유저들에게 보상해도 contract 안에 1이더 이상 있도록 설계

  // odd가 변경되었을 때 체크
  let oddCheck = false;
  const selectTeam = { "odd.homeTeam": 1, "odd.drawTeam": 1, "odd.awayTeam": 1, "odd.homeTeamAndDraw": 1, "odd.homeAndAwayTeam": 1, "odd.awayTeamAndDraw": 1, "odd.under": 1, "odd.over": 1 };

  const game = await DB_gameInfo.findOne({ fixture_id: fixtureId }).select(selectTeam).exec();
  switch (selectedTeam) {
    case 1: oddCheck = (game.odd.homeTeam == odd) ? true : false; break;
    case 2: oddCheck = (game.odd.drawTeam == odd) ? true : false; break;
    case 3: oddCheck = (game.odd.awayTeam == odd) ? true : false; break;
    case 4: oddCheck = (game.odd.over == odd) ? true : false; break;
    case 5: oddCheck = (game.odd.under == odd) ? true : false; break;
    case 6: oddCheck = (game.odd.homeTeamAndDraw == odd) ? true : false; break;
    case 7: oddCheck = (game.odd.homeAndAwayTeam == odd) ? true : false; break;
    case 8: oddCheck = (game.odd.awayTeamAndDraw == odd) ? true : false; break;
  }

  // console.log(`odd : ${odd}, oddCheck: ${oddCheck}`);
  // console.log(` oddCheck: ${oddCheck}, maxPotCheck: ${maxPotCheck}`);
  res.json({ oddCheck: oddCheck, maxPotCheck: maxPotCheck});
})


async function _getEthPrice() {
  // console.log('고팍스에서 이더 시세가져오기');
  const apiSite = `https://api.gopax.co.kr/trading-pairs/ETH-KRW/stats`;
  let resultOdd;
  try {
    resultOdd = await request.get({
      url: apiSite,
    });
  } catch (err) {
    console.log(err);
    res.status(404).end();
  }
  const result = JSON.parse(resultOdd);
  // console.log(result.close);
  return result.close;
}

async function _sendSNS(userAccount, fixtureId, teamName, stake, odd, market, transaction){
  try{
    // const dummyAddressList = await DB_dummy.find({ isUse: true }).select({ address: 1, _id: 0 });
    const dummyAddressList = await DB_dummy.findOne({ address: userAccount }).select({ address: 1, _id: 0 });
    if (dummyAddressList) return;
    // console.log(userList);
    const userList = [
      "0x0F5EBe4525e54EBCdEA606e825C444910662fa18",
      "0x2CDf23895e934767cEF1c1ebD6FEA316a22d38e2",
      "0x9F280D653a740A5Fb7C2bd45CaBa5Fd9B1247E33",
      "0x30d62711358Fcb2350105B5FEBa263414Aa921ca",
      "0xC7ef003b2095AeabFebdE91Bfe4D553F098A9C14",
      "0xd8D265b0B6A247FfF691Cf2c34C3dEFE898F2b0E",
      "0xf725a718910d5BCda3b1ddbb89C4cCf344818Efd",
      "0xa3D7875A72394c951535F4741e712456A25C8D8e",
      "0x33a17263090c4B5e16DdaF96a163462fB0DCE405",
      "0x49D2A66E58c4Ca2C87396DcAdA94FdFec79d500B",
      "0x0179e770df371EE8c25585947555bc44E5b8375E",
    ];
    const isMe = userList.findIndex( user => user == userAccount); // 내 계정에서 결제했는지 체크
    if(isMe != -1) return; // 내가 결제했다면 리턴
  
    let ethPrice = 230000;
    ethPrice = await _getEthPrice();
    // 매출 읽기 좋게 바꾸기
    const sales = utils.pickComma( (ethPrice * stake).toFixed(0) );
  
    // 메일 보내기
    paidUser.subject = `유저 ${stake} 베팅`;
    const createdAt = utils.getWhen('txtDate');
    paidUser.html = `
  <p>Date        : ${createdAt}</p>
  <p>User        : <a href="https://whitebetting.com/user/${userAccount}">${userAccount}</a></p>
  <p>odd         : ${odd}</p>
  <p>Sales       : ${sales}원<p>
  <p>game        : <a href="https://whitebetting.com/game/${fixtureId}">${fixtureId}</a></p>
  <p>teamName    : ${teamName}</p>
  <p>market      : ${market}</p>
  <p>transaction : <a href="https://etherscan.io/tx/${transaction}">${transaction}</a></p>
    `;
    transporter.sendMail(paidUser, (err) => { if (err) console.log(err); });
  
    // 슬랙에 매출 push 하기
    const slackUrl = `https://hooks.slack.com/services/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`;
    try {
      request.post({
        url: slackUrl,
        headers: { 'Content-Type': 'application/json' },
        json: {
          text: `
  날짜   : ${createdAt}
  고객   : https://whitebetting.com/user/${userAccount}
  배당률 : ${odd}
  매출   : ${sales}원
  경기   : https://whitebetting.com/game/${fixtureId}
  베팅   : ${teamName}
  베팅종류  : ${market}
  트랜잭션 : https://etherscan.io/tx/${transaction}
          `
        },
      });
    } catch (err) {
      console.log(err);
      return;
    }

  } catch(err){ console.log(err); return;}
}


route.post('/setBetInfo', async (req, res)=>{
  const { userAccount, fixtureObjId, fixtureId, selectedTeam, teamName, stake, odd,  market, transaction } = req.body;
  _sendSNS(userAccount, fixtureId, teamName, stake, odd, market, transaction);
  // req.setTimeout(3600000); // 1시간 대기
  // console.log(userAccount, fixtureObjId, fixtureId, selectedTeam, teamName, stake, odd, market, transaction);
  // console.log('transaction: '+transaction);
  // const web3 = new Web3(config.contract.serverAddress); // Infra 서버주소를 넣는다.
  // const txInfo = await web3.eth.getTransaction(transaction);
  // const isReal = await web3.eth.getTransactionReceipt(transaction);
  // console.log('txInfo');
  // console.log(txInfo);
  // console.log('isReal');
  // console.log(isReal);
  // if (txInfo && isReal.status) { // 영수증을 받은 후 써있는 정보를 비교한다
    // const contractInfo = { abi: config.contract.abi, address: config.contract.address } // contract 정보 가져오기
    // const wbContract = new web3.eth.Contract(contractInfo.abi, contractInfo.address);
  // const contractData = wbContract.methods.placeBet(fixtureId, selectedTeam, parseInt(odd * 1000)).encodeABI();

    // const stakeEth = web3.utils.toWei(stake, 'ether');
    // if (txInfo.from == userAccount && txInfo.value == stakeEth && txInfo.input == contractData ){

      const user = await DB_userAccount.findOne({ user: userAccount }).select({ "stat.white":1 });
      if (user){ // 유저가 있다면
        if (user.stat){
          user.stat.white += parseInt(parseFloat(stake * 1000))/1000;
        } else {
          user.stat.white += parseInt(parseFloat(stake * 1000)) /1000;
        }
        user.save();
      } else { // DB에 유저가 없다면 새로 만들자
        console.log('유저가 없으니 새로 만들자');
        const user      = userAccount;
        const isMobile  = false; //                <=이거 이상하다. isMobile을 정상적으로 받아오고 betting에서도 모바일인지 확인할수 있게 하자.19.12.13
        const ipAddress = get_ip(req).clientIp;
        const dateNow   = Date.now();
        new DB_userAccount ({
          user          : user,
          isMobile      : isMobile,
          ip_address    : ipAddress,
          createdAt     : dateNow,
          signIn        : [ { ip_address : ipAddress, at : dateNow, isMobile : isMobile }],
          stat          : { white: parseInt(parseFloat(stake * 1000)) / 1000 }
        }).save();
      }
      new DB_betInfo({
        // fixture_Obj_id : mongoose.Types.ObjectId(fixtureObjId),
        fixture_Obj_id : fixtureObjId,
        fixture_id     : fixtureId,
        createdAt      : Date.now(),
        user           : userAccount,
        selectedTeam   : selectedTeam,
        teamName       : teamName,
        stake          : stake,
        odd            : odd,
        market         : market,
        transaction    : transaction,
      }).save();
    // }
  // }

  res.status(200).end();
})

// 게임정보 가져오기
route.get('/getGameInfo', async (req, res) => {
  // 쿠키값이나 queryString으로 들어온 hashKey를 서버에 보낼 수 있다.
  const { hashKey, fixtureId } = req.query;
  // const cookieHashKey = config.cookie.hashkey;

  const fo       = { fixture_id: fixtureId };
  const s        = { createdAt : -1        };
  const selectTeam = { "odd.total": 0, pre_odd :0 };

  const gameInfo = await DB_gameInfo.findOne(fo).sort(s).select(selectTeam).exec();
  // console.log(gameInfo);
  res.json(gameInfo);
})

// bet history
route.get('/getBetHistory', async (req, res)=>{
  const { fixtureId } = req.query;
  const f          = { fixture_id: fixtureId };
  const s          = { createdAt: -1 };
  const selectUser = { fixture_id: 1, user: 1, createdAt: 1, selectedTeam: 1, teamName: 1, stake: 1, odd: 1, market: 1, returnEth: 1, transaction: 1 };

  const allHistory = await DB_betInfo.find(f).sort(s).select(selectUser).exec(); // 모든 게임 정보
  res.json(allHistory);
})

module.exports = route;