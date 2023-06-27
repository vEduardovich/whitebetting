const express        = require('express');
const route          = express.Router();
// const fs          = require('fs');
const request        = require('request-promise');
const nodemailer     = require('nodemailer');

const config         = require('../commons/config');
const utils          = require('../commons/utils.js');

const DB_gameInfo    = require('../models/gameInfo'); // 게임 정보
const DB_betInfo     = require('../models/betInfo'); // 베팅 정보
const DB_userAccount = require('../models/userAccount');
const DB_dummy       = require('../models/dummy'); // 베팅 정보
const DB_standings   = require('../models/standings');// 순위정보
const DB_comment     = require('../models/comment');// 순위정보

const Web3           = require('web3');
const transporter    = nodemailer.createTransport( config.mail.transporter );
const paidUser       = config.mail.paidUser; // 새로 가입한 회원

function _makeNewComment(req, isMobile, replyId, textareaTxt, userAccount, avatarNum, mainCommentId){
  const newComment = {
    createdAt       : Date.now(),
    isMobile        : isMobile,
    category        : 1,// 게임 게시판
    replyId         : replyId,// 고유답글id
    article         : textareaTxt,
    user            : userAccount,
    avatar_num      : avatarNum,
    main_comment_id : mainCommentId,// 부모글의 id
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
  try {
    const reply = await DB_comment.findById(commentId).select({ sub_comment_arr: 1 });
    const replyIdx = reply.sub_comment_arr.findIndex(el => el.replyId == replyId); // 유저당
    const tempObj = { isMobile: isMobile, user: user, createdAt: Date.now()};
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
  try {
    const comment = await DB_comment.findById(commentId ).select({score: 1 });
    const tempObj = { isMobile: isMobile, user: user, createdAt: Date.now()};
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
  console.log('isMobile, fixtureId, fixtureObjId, category, textareaTxt, userAccount, avatarNum');
  console.log(isMobile, fixtureId, fixtureObjId, category, textareaTxt, userAccount, avatarNum);
  const newComment = {
    createdAt   : Date.now(),
    user        : userAccount,
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

  try{
    if (rank[0]){
      const rankInfo = rank[0].rankArr;
      rankInfo.map((all, idx) => {
        const homeTeamIndex = all.findIndex(el => el.team_id == homeTeamId);
        const awayTeamIndex = all.findIndex(el => el.team_id == awayTeamId);
        if (homeTeamIndex != -1) {
          // fixtureTeams.push(all[homeTeamIndex]);
          // 아래와 같이 필요한 정보들만 추려서 전달한다
          fixtureTeams.push({ rank: all[homeTeamIndex].rank, all: { win: all[homeTeamIndex].all.win, draw: all[homeTeamIndex].all.draw, lose: all[homeTeamIndex].all.lose }, forme: all[homeTeamIndex].forme });
        }
        if (awayTeamIndex != -1) {
          // fixtureTeams.push(all[awayTeamIndex])
          fixtureTeams.push({ rank: all[awayTeamIndex].rank, all: { win: all[awayTeamIndex].all.win, draw: all[awayTeamIndex].all.draw, lose: all[awayTeamIndex].all.lose }, forme: all[awayTeamIndex].forme });          
        };
      })
      // 0자리에 homeTeam, 1자리에 awayTeam 으로 집어넣는다
      res.json(fixtureTeams)      
    } else { res.status(200).end(); }

  } catch (err) { console.log(err); res.status(200).end();}

})

route.post('/getMaxPot', async (req, res)=>{
  async function _getCABalance(){ // contract 잔액 가져오기
    const web3 = _selectInfura();

    // 아래는 새로 변경한(20.03.12) owner의 밸런스를 가져오는 거
    const caBalance = await web3.eth.getBalance(config.contract.owner);
    console.log('caBalance');
    console.log(caBalance);
    const contractPot = web3.utils.fromWei(caBalance, 'ether'); // wei to ether

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
  const fo      = { returnEth : { $exists: false } }; // returnEth라는 필드자체가 없는것만 찾아온다.
  const selectUser = { selectedTeam: 1, stake: 1, odd: 1 };
  const betInfo = await DB_betInfo.find(fo).select(selectUser).exec();// returnEth값이 있는 것들만 가져온다

  // 1: homeTeam, 2: drawTeam, 3: awayTeam, 4: over, 5: under, 6:homeTeamAndDraw, 7: homeAndAwayTeam, 8: awayTeamAndDraw
  // 최대 베팅 가능금액 계산
  const mp = { homeOver : 0, homeUnder : 0, drawOver : 0, drawUnder : 0, awayOver : 0, awayUnder : 0 };
  // let totalStake = 0;
  betInfo.map( bet =>{
    _makeMaxPot(mp, bet);
  })
  _makeMaxPot(mp, { selectedTeam: selectedTeam, stake : stake, odd : odd }); // 이제 추가할 베팅이 가능한지 확인

  // console.log(mp);
  const maxReturnEth = Math.max(mp.homeOver, mp.homeUnder, mp.drawOver, mp.drawUnder, mp.awayOver, mp.awayUnder);
  const checkMaxPot = ((contractPot * 1000000) - maxReturnEth) / 1000000; // contract pot - maxReturnEth
  const maxPotCheck = checkMaxPot > 1; // 아무리 유저들에게 보상해도 contract 안에 1이더 이상 있도록 설계

  const oddCheck = await checkOdd(fixtureId, selectedTeam, odd);

  res.json({ oddCheck: oddCheck, maxPotCheck: maxPotCheck});
})

// odd가 변경되었을 때 체크
async function checkOdd(fixtureId, selectedTeam, odd){
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
  return oddCheck;
}

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
    const dummyAddressList = await DB_dummy.findOne({ address: userAccount }).select({ address: 1, _id: 0 });
    if (dummyAddressList) return;
    const userList = [
      "dummy user address",
      "dummy user address",
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
  <p>game        : <a href="https://whitebetting.com/football/${fixtureId}">${fixtureId}</a></p>
  <p>teamName    : ${teamName}</p>
  <p>market      : ${market}</p>
  <p>transaction : <a href="https://etherscan.io/tx/${transaction}">${transaction}</a></p>
    `;
    transporter.sendMail(paidUser, (err) => { if (err) console.log(err); });
  
    // 슬랙에 매출 push 하기
    const slackUrl = `xxxxx`;// 슬랙 주소 입력
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
  경기   : https://whitebetting.com/football/${fixtureId}
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


// 랜덤하게 infura 계정을 선택한 후 리턴해주는 함수
function _selectInfura() {
  const randInfura = utils.randRange(1, 4);
  let web3;
  // 아래의 방식을 확인해보고 괜찮으면 infura계정을 5개 더 만들어 돌리자.
  if (randInfura == 1) {
    web3 = new Web3(config.contract.serverAddress1);
  } else if (randInfura == 2) {
    web3 = new Web3(config.contract.serverAddress);
  } else if (randInfura == 3) {
    web3 = new Web3(config.contract.serverAddress2);
  } else if (randInfura == 4) {
    web3 = new Web3(config.contract.serverAddress3);
  }
  return web3;
}

route.post('/checkTx', async (req, res)=>{
  console.log('setTx!');
  const { userAccount, isMobile, fixtureId, fixtureObjId, selectedTeam, odd, stake, teamName, market, hash } = req.body;
  const oddCheck = await checkOdd(fixtureId, selectedTeam, odd);
  if (!oddCheck) { console.log('odd 조작시도!'); res.status(202).end(); return;}// 만약 여기서 odd가 맞지 않는다면 이건 해킹시도다. 그냥 버린다.

  const web3 = _selectInfura();// Infra 서버주소를 넣는다.
  const txInfo = await web3.eth.getTransaction(hash);
  const isReal = await web3.eth.getTransactionReceipt(hash);
  console.log(txInfo);
  const stakeEth = web3.utils.toWei(stake, 'ether');

  const checkEth = (stakeEth == txInfo.value);// tx에 적힌 이더와 비교
  const checkTo = (config.contract.address == txInfo.to );// tx에 적힌 to주소와 비교
  
  // stake와 받는주소가 일치하고 방금 막 생성된 tx인지 확인 후
  if (checkEth && checkTo && !isReal) {// true라면
    new DB_betInfo({
      createdAt      : Date.now(),
      isMobile       : isMobile,
      fixture_id     : fixtureId,
      fixture_Obj_id : fixtureObjId,
      user           : userAccount,
      teamName       : teamName,
      market         : market,
      selectedTeam   : selectedTeam,
      odd            : odd,
      stake          : stake,
      transaction    : hash,
      isTxCertain    : false,// receipt을 받으면 setBetInfo를 통해 true로 바꾼다
    }).save();

    // 유저 white처리. 나중에 isTxCertain이 false가 뜨면 다시 뺀다. 일단 더해주자.
    const user = await DB_userAccount.findOne({ user: userAccount }).select({ "stat.white": 1 });
    if (user) { // 유저가 있다면
      if (user.stat) {
        user.stat.white += parseInt(parseFloat(stake * 1000)) / 1000;
      } else {
        user.stat.white += parseInt(parseFloat(stake * 1000)) / 1000;
      }
      user.save();
    } else { // DB에 유저가 없다면 새로 만들자
      console.log('유저가 없으니 새로 만들자');
      const dateNow = Date.now();
      new DB_userAccount({
        user       : userAccount,
        isMobile   : isMobile,
        createdAt  : dateNow,
        signIn     : [{ at: dateNow, isMobile: isMobile }],
        stat       : { white: parseInt(parseFloat(stake * 1000)) / 1000 }
      }).save();
    }

    _sendSNS(userAccount, fixtureId, teamName, stake, odd, market, hash);

    console.log('Done!');
  } else{ console.log('뭔가 값이 다르네');}
})

// 베팅 테스트!
route.post('/setBetInfoTest', async (req, res) => {
  const { transaction } = req.body;
  console.log(transaction);
  const web3 = _selectInfura();// Infra 서버주소를 넣는다.

  const isReal = await web3.eth.getTransactionReceipt(transaction);
  const newBet = await DB_betInfo.findOne({ transaction: transaction }).select({ createdAt: -1, user: -1, fixture_id: -1, fixture_Obj_id: -1, selectedTeam: -1, odd: -1, stake: -1, teamName: -1, market: -1, transaction: -1 }).exec();

  if (isReal && newBet) {
    console.log(1);
    if (isReal.status) { // 유저 베팅이 실제라면
      newBet.isTxCertain = true;
      console.log(newBet);
      newBet.save();
      console.log('세이브 완료');      
    }
  } else { console.log('가짜베팅. 취소Tx: ' + transaction);}

  res.status(200).end();
})


route.post('/setBetInfo', async (req, res)=>{
  const { userAccount, fixtureObjId, fixtureId, selectedTeam, teamName, stake, odd,  market, transaction } = req.body;
  _sendSNS(userAccount, fixtureId, teamName, stake, odd, market, transaction);

      const user = await DB_userAccount.findOne({ user: userAccount }).select({ "stat.white":1 });
      if (user){ // 유저가 있다면
        if (user.stat){
          user.stat.white += parseInt(parseFloat(stake * 1000))/1000;
        } else {
          user.stat.white += parseInt(parseFloat(stake * 1000)) /1000;
        }
        user.save();
      } else { // DB에 유저가 없다면 새로 만들자
        const user      = userAccount;
        const isMobile  = false; //                <=이거 이상하다. isMobile을 정상적으로 받아오고 betting에서도 모바일인지 확인할수 있게 하자.19.12.13
        const dateNow   = Date.now();
        new DB_userAccount ({
          user          : user,
          isMobile      : isMobile,
          createdAt     : dateNow,
          signIn        : [ { at : dateNow, isMobile : isMobile }],
          stat          : { white: parseInt(parseFloat(stake * 1000)) / 1000 }
        }).save();
      }
      new DB_betInfo({
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
  res.json(gameInfo);
})

// bet history
route.get('/getBetHistory', async (req, res)=>{
  const { fixtureId } = req.query;
  const f          = { fixture_id: fixtureId };
  const s          = { createdAt: -1 };
  const selectUser = { fixture_id: 1, user: 1, createdAt: 1, selectedTeam: 1, teamName: 1, stake: 1, odd: 1, market: 1, returnEth: 1, transaction: 1, reward_tx:1, };

  const allHistory = await DB_betInfo.find(f).sort(s).select(selectUser).exec(); // 모든 게임 정보
  res.json(allHistory);
})

module.exports = route;