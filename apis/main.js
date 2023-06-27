const express        = require('express');
const route          = express.Router();
const utils          = require('../commons/utils.js');
const DB_gameInfo    = require('../models/gameInfo'); // 게임 정보
const DB_betInfo     = require('../models/betInfo'); // 베팅 정보
const DB_rank        = require('../models/rank'); // 베팅 정보
const DB_comment     = require('../models/comment');// 순위정보


route.get('/getNewComments', async (req, res) => {
  const f = { isDeleted : false };// 삭제된 덧글은 메인에 안보여준다
  const sort = { createdAt: -1 };
  const l = 4;
  const select = { createdAt: 1, category: 1, fixture_id: 1, fixture_Obj_id: 1, sub_comment_arr: 1, user: 1, avatar_num: 1, article: 1, count: 1, score: 1, user_Obj_id: 1, isDeleted: 1, notice: 1 };
  const selectTeam = { "odd.homeTeam": 1, "odd.drawTeam": 1, "odd.awayTeam": 1, "odd.homeTeamAndDraw": 1, "odd.homeAndAwayTeam": 1, "odd.awayTeamAndDraw": 1, "odd.under": 1, "odd.over": 1 };
  const comments = await DB_comment.find(f).sort(sort).limit(l).select(select).lean().populate('fixture_Obj_id', 'event_date league_id round homeTeam awayTeam status odd').populate('user_Obj_id', 'stat.white').exec();
  res.json(comments);
})


route.get('/getHotGameList', async (req, res) => {
  try {
    const dt = new Date();
    let f = { event_date: { '$gte': dt }, open_status : 3, hot_game : true }; // 오늘 이후의 open된 게임들만 정리해서
    let s = { event_date : 1 };
    let l = 10;
    const selectTeam = { fixture_id: 1, event_timestamp: 1, event_date: 1, league_id: 1, round: 1, homeTeam_id: 1, homeTeam: 1, awayTeam: 1, awayTeam_id: 1, "league.name":1, "odd.homeTeam": 1, "odd.drawTeam": 1, "odd.awayTeam": 1, "odd.homeTeamAndDraw": 1, "odd.homeAndAwayTeam": 1, "odd.awayTeamAndDraw": 1, "odd.under": 1, "odd.over": 1, _id: 0 };

    const hotCheckedGames = await DB_gameInfo.find(f).sort(s).limit(l).select(selectTeam).exec();
    if (hotCheckedGames.length < 10 ){ // hot check된 게임이 10개가 안된다면 추가로 query를 날린다.
      // 오늘 이후 베팅가능한 인기팀들만 뽑는다.
      const teams = [40, 50, 47, 33, 42, 49, 529, 530, 541];
      f = { $or: [{ homeTeam_id: { $in: teams } }, { awayTeam_id: { $in: teams } }], event_date: { '$gte': dt } , open_status: 3 } ;
      l = 10 - hotCheckedGames.length;
      const hotTeamList = await DB_gameInfo.find(f).sort(s).limit(l).select(selectTeam).exec();
      const sumCheckedAndTeams = hotCheckedGames.concat(hotTeamList); 
      const checkedAndTeams = utils.getUniqueObjArr(sumCheckedAndTeams, 'fixture_id');

      if ((checkedAndTeams.length) < 10){
        // 모든 게임들을 최신순으로 정렬한 후 10개를 뽑는다.
        f = { event_date: { '$gte': dt }, open_status: 3 };
        // l = 10 - checkedAndTeams.length;
        const allGameList = await DB_gameInfo.find(f).sort(s).select(selectTeam).exec();
        const sumAll = checkedAndTeams.concat(allGameList);
        const hotGameList = utils.getUniqueObjArr(sumAll, 'fixture_id');        
        hotGameList.splice(10);
        res.json(hotGameList);
      } else {
        const hotGameList = checkedAndTeams;
        res.json(hotGameList);
      }
    } else {
      const hotGameList = hotCheckedGames;
      res.json(hotGameList);
    }
  } catch(err) {
    console.log(err);
    res.status(400).end();
  }
})

// get in-play games list
route.post('/getInPlayGame', async (req, res) => { 
  const f = { open_status: 4 };
  const s = { event_date: -1 };
  const l = 5;
  const selectTeam = { fixture_id: 1, event_date: 1, league_id: 1, round: 1, homeTeam: 1, awayTeam: 1, goalsHomeTeam: 1, goalsAwayTeam: 1,_id: 0 };   
  const gameList = await DB_gameInfo.find(f).sort(s).limit(l).select(selectTeam).exec();
  res.json(gameList);
})

// get closed games list
route.post('/getClosedGame', async (req, res) => {  
  const f = { open_status: 5 };
  const s = { event_date: -1 };
  const l = 5;  
  const selectTeam = { fixture_id: 1, event_date: 1, league_id: 1, round: 1, homeTeam: 1, awayTeam: 1, goalsHomeTeam: 1, goalsAwayTeam: 1, _id: 0 };   
  const gameList = await DB_gameInfo.find(f).sort(s).limit(l).select(selectTeam).exec();
  res.json(gameList);
})

// 19.12.20 새벽 3시 14분에 새로 만든 모듈 적용
route.post('/getUserRankList', async (req, res) => {
  const s = { createdAt: -1 };
  // 메인화면에서는 배열중 5개만 가져온다.
  const selectUser = { 'userRank' : { $slice : 5 }, }; 
  const userList = await DB_rank.findOne().sort(s).select(selectUser).exec();
  res.json(userList);
})

route.get('/getLatestBetsList', async (req, res) => {
  try {
    const s = { createdAt: -1 };
    const l = 5;
    const selectUser = { fixture_id: 1, createdAt:1, user: 1, stake: 1, _id: 0 };    
    const latestBetsList = await DB_betInfo.find().sort(s).limit(l).select(selectUser).exec();
    res.json(latestBetsList);
  } catch {
    res.status(400).end();
  }
})

module.exports = route;