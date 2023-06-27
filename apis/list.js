const express     = require('express');
const route       = express.Router();
const utils       = require('../commons/utils.js');
const DB_gameInfo = require('../models/gameInfo'); // 게임 정보
const DB_betInfo  = require('../models/betInfo'); // 베팅 정보
const DB_rank     = require('../models/rank'); // 베팅 정보

route.post('/getMatchInfoList', async (req, res) => {
  const { page, pageNum } = req.body;  
  const selectTeam = { fixture_id: 1, event_timestamp: 1, event_date: 1, league_id: 1, round: 1, homeTeam_id: 1, homeTeam: 1, awayTeam: 1, awayTeam_id: 1, goalsHomeTeam: 1, goalsAwayTeam: 1, "league.name": 1, _id: 0 }; 
  
  if (page.category == 4) { // In-Play Matches page
    const f = { open_status: 4 };
    const s = { event_date: -1 };
    const gameList = await DB_gameInfo.find(f).sort(s).select(selectTeam).exec();

    res.json(gameList);
  } else if (page.category == 5) { // Finished Matches page
    const f = { open_status: 5 };
    const s = { event_date: -1 };
    // const skip = step * page; // page는 클라에서 받아야한다.
    const l = 100;
    try {
      const gameList = await DB_gameInfo.find(f).sort(s).limit(l).select(selectTeam).exec();
      res.json(gameList);

    } catch (err) {
      console.log(err);
      res.status(400).end();
    }
  } 

})
// 19.10.02 hotGameList를 뽑아올때 방식 변경하려했으나 포기. 나중에 훌륭한 개발자가 수정해줄거다;
// 다시 수정 도전.
route.post('/getGameList', async (req, res) => {
  // 나중에 페이징을 사용할때 pageNum으로 값을 받아서 처리한다.
  // 현재는 넘겨줄때 sort()한계인 32메가를 넘어가기에 작업처리가 지저분해지고 속도가 더 빨라지지 않는데 가져오는 데이터 양의 차이도 없어 개발 완료했다가 다시 원래대로 되돌렸다 19.11.08
  const { page, pageNum } = req.body;
  const dt = new Date();
  const selectTeam = { fixture_id: 1, event_timestamp: 1, event_date: 1, league_id: 1, round: 1, homeTeam_id: 1, homeTeam: 1, awayTeam: 1, awayTeam_id: 1, "league.name": 1, "odd.homeTeam": 1, "odd.drawTeam": 1, "odd.awayTeam": 1, "odd.homeTeamAndDraw": 1, "odd.homeAndAwayTeam": 1, "odd.awayTeamAndDraw": 1, "odd.under": 1, "odd.over": 1, _id: 0 }; 

  try {
    if (page.category == 1) { // 리그 페이지 보여주기
      const f = { league_id: page.id, event_date: { '$gte': dt }, open_status : { $ne: 10} };// not equal
      const s = { event_date: 1 };

      const gameList = await DB_gameInfo.find(f).sort(s).limit(30).select(selectTeam).exec(); // 데이터 부하 테스트로 limit를 걸어본다. 19.09.02. 오. 속도가 훨~씬 빨라진다. 일단 이렇게 잡아놓고 나중에 옵션으로 전체 검색 넣자.
      res.json(gameList);

    } else if (page.category == 2) { // 팀페이지 보여주기
      // 오늘 날짜 이후의 게임 중에 page.id가 있는 팀의 목록을 모두 불러온다
      const f = {
        $or: [{ homeTeam_id: page.id }, { awayTeam_id: page.id }],
        event_date: { '$gte': dt }
      };
      const s = { event_date: 1 };

      const gameList = await DB_gameInfo.find(f).sort(s).select(selectTeam).exec();
      res.json(gameList);

    } else if (page.category == 3) { // hot games 페이지
      try {
        // , odd: { awayTeam: 1 }
        const dt = new Date();
        let f = new Object();
        f = { event_date: { '$gte': dt }, open_status: 3, hot_game: true }// 오늘 이후의 open된 게임들만 정리해서
        const s = { event_date: 1 };
        const hotCheckedGames = await DB_gameInfo.find(f).sort(s).select(selectTeam).exec();

        // 오늘 이후 베팅가능한 인기팀들만 뽑는다.
        const teams = [40, 50, 47, 33, 42, 49, 529, 530, 541];
        f = { $or: [{ homeTeam_id: { $in: teams } }, { awayTeam_id: { $in: teams } }], event_date: { '$gte': dt }, open_status: 3 };
        const hotTeamList = await DB_gameInfo.find(f).sort(s).select(selectTeam).exec();
        const sumCheckedAndTeams = hotCheckedGames.concat(hotTeamList); // checked와 team 목록을 합친후
        // 아래와 같이 해당 object의 fixture_id의 값이 중복되는 것들을 제거한다.
        const checkedAndTeams = utils.getUniqueObjArr(sumCheckedAndTeams, 'fixture_id');

        // 모든 게임들을 최신순으로 정렬한 후 모두 뽑는다.
        f = { event_date: { '$gte': dt }, open_status: 3 };
        const allGameList = await DB_gameInfo.find(f).sort(s).select(selectTeam).exec();
        const sumAll = checkedAndTeams.concat(allGameList);
        const hotGameList = utils.getUniqueObjArr(sumAll, 'fixture_id');

        // utils.timeChk(dt); // 걸린시간 체크
        res.json(hotGameList);

      } catch {
        console.log(err);
        res.status(400).end();
      }

    } else if (page.category == 6) { // Player Rank page. main.js에서 그대로 가져옴
      const s = { createdAt: -1 };
      // 메인화면에서는 배열중 5개만 가져온다.
      const selectUser = { 'userRank': { $slice: 100 }, };
      const userList = await DB_rank.findOne().sort(s).select(selectUser).exec();
      res.json(userList);

    } else if (page.category == 7){ // Latest bet 이라면
      try{
        const s = { createdAt: -1 };
        const l = 100;
        const selectUser = { fixture_id: 1, createdAt: 1, selectedTeam: 1, teamName: 1, stake: 1, odd: 1, market: 1, returnEth: 1, transaction: 1 };    

        const betInfo = await DB_betInfo.find().limit(l).sort(s).lean().populate('fixture_Obj_id', 'fixture_id event_date league_id round homeTeam awayTeam status').select(selectUser).exec();
        res.json(betInfo);
      } catch(err){
        console.log(err);
        res.status(400).end();
      }

      res.json(gameList);
    }
  } catch {
    res.status(400).end(); // 400 Bad Request
  }

})


module.exports = route;