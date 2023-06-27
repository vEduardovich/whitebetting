const express     = require('express');
const ip          = require('ip');
const route       = express.Router();
const fs          = require('fs');
const config 	    = require('../../commons/config');
const utils       = require('../../commons/utils.js');
const DB_oddInfo  = require('../models/oddInfo'); // 배당률 정보
const DB_gameInfo = require('../../models/gameInfo'); // 게임 정보
const DB_betInfo  = require('../../models/betInfo'); // 베팅 정보
const DB_userAccount = require('../../models/userAccount'); // 베팅 정보

route.get('/getLatestBetsList', async (req, res) => {
  try {
    const s = { createdAt: -1 };
    const latestBetsList = await DB_betInfo.find().sort(s).exec();
    res.json(latestBetsList);
  } catch {
    res.status(400).end();
  }
})

route.get('/getUserRankList', async (req, res) => {
  try {
    const s = { createdAt: -1 };
    const userRankList = await DB_userAccount.find().sort(s).exec();
    res.json(userRankList);
  } catch {
    res.status(400).end();
  }
})

route.get('/getHotGameList', async (req, res)=>{
  try{
    const s = { createdAt: -1 }; 
    const hotGameList = await DB_gameInfo.find().sort(s).exec();
    res.json(hotGameList);
  } catch {
    res.status(400).end();
  }
})

route.get('/getUserBetInfo', async (req, res)=>{
  const { userAccount } = req.query;
  const s = { createdAt: -1 };  
  if (userAccount){
    const f = { user: userAccount};
    const userBetInfo = await DB_betInfo.find(f).sort(s).populate('fixture_Obj_id').exec();
    // const userBetInfo = await DB_betInfo.findOne(f).sort(s).exec();
    res.json(userBetInfo);
  } else{
    res.status(400).end(); // 400 Bad Request
  }
  
})

route.post('/setBetInfo', (req, res)=>{
  const { userAccount, fixtureObjId, fixtureId, selectedTeam, teamName, stake, odd, underOver, market, transaction } = req.body;
  // const game = (underOver) ? 'Goals Over/Under' : 'Final Time Result';
  new DB_betInfo({
    fixture_Obj_id: fixtureObjId,
    fixture_id    : fixtureId,
    createdAt     : Date.now(),
    user          : userAccount,
    selectedTeam  : selectedTeam,
    teamName      : teamName,
    stake         : stake,
    odd           : odd,
    underOver     : underOver,
    market        : market,
    transaction   : transaction,
  }).save();

  res.status(200).end();
})

route.get('/getBetHistory', async (req, res)=>{
  const { fixtureId } = req.query;
  const f   = { fixture_id: fixtureId };
  const s   = { createdAt: -1 };
  
  const allHistory  = await DB_betInfo.find(f).sort(s).exec(); // 모든 게임 정보
  res.json(allHistory);
})

route.get('/getGameInfo', async (req, res) => {
  // 쿠키값이나 queryString으로 들어온 hashKey를 서버에 보낼 수 있다.
  const { hashKey, fixtureId } = req.query;
  const cookieHashKey = config.cookie.hashkey;

  if ( cookieHashKey == req.cookies.hashKey || cookieHashKey == hashKey ){
    const fo = {fixture_id: fixtureId};
    const s = { createdAt : -1 };
    const gameInfo = await DB_gameInfo.findOne(fo).sort(s).exec();
    res.json( gameInfo );
  } else { res.json( { err : '누구냐 넌' } );}
})

route.get('/getOddInfo', async (req, res) => {
  const { hashKey, fixtureId } = req.query;
  const cookieHashKey = config.cookie.hashkey;

  if ( cookieHashKey == req.cookies.hashKey || cookieHashKey == hashKey ){
    const fo = {fixture_id: fixtureId};
    const s = { createdAt : -1 };
    const oddInfo = await DB_oddInfo.findOne(fo).sort(s).exec();
    res.json( oddInfo );
  } else { res.json( { err : '누구냐 넌' } );}
})

module.exports = route;