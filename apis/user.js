const express = require('express');
const route = express.Router();
const DB_betInfo = require('../models/betInfo'); // 베팅 정보
const DB_userAccount = require('../models/userAccount'); // 베팅 정보

route.post('/getUserWhite', async (req, res) => {
  const { userAccount } = req.body;

  if (userAccount) {
    const f = { user: userAccount };
    const user = await DB_userAccount.findOne(f).select({ signIn : 0 });
    if (user){
      res.json( parseInt(parseFloat(user.stat.white * 1000))/1000 );
    } else res.json(0);
  } else {
    res.json(userAccount); // 유저가 없다면 그냥 되돌려준다.
  }
})

route.get('/getUserBetInfo', async (req, res) => {
  const { userAccount } = req.query;
  const s = { createdAt: -1 };
  const selectUser = { fixture_id: 1, createdAt: 1, selectedTeam: 1, teamName: 1, stake: 1, odd: 1, market: 1, returnEth: 1, transaction: 1, fixture_Obj_id: 1, };    
  
  if (userAccount) {
    const f = { user: userAccount };
    // 아래와 같이 원하는 필드만 가져온다.
    const userBetInfo = await DB_betInfo.find(f).sort(s).populate('fixture_Obj_id', 'fixture_id event_date league_id round homeTeam awayTeam status league.name').select(selectUser);
    res.json(userBetInfo);
  } else {
    res.status(400).end(); // 400 Bad Request
  }
})

module.exports = route;