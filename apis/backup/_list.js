const express = require('express');
const route = express.Router();
const utils = require('../commons/utils.js');
const DB_gameInfo = require('../models/gameInfo'); // 게임 정보
const DB_betInfo = require('../models/betInfo'); // 베팅 정보
// const DB_userAccount = require('../models/userAccount'); // 베팅 정보

// 19.10.02 hotGameList를 뽑아올때 방식 변경하려했으나 포기. 나중에 훌륭한 개발자가 수정해줄거다;
// 다시 수정 도전.

route.post('/getGameList', async (req, res) => {
  const { page } = req.body;
  const dt = new Date();
  try {
    if (page.category == 1) { // 리그 페이지 보여주기
      const f = { league_id: page.id, event_date: { '$gte': dt } };
      const s = { event_date: 1 };

      // const gameList = await DB_gameInfo.find(f).sort(s).exec();
      const gameList = await DB_gameInfo.find(f).sort(s).limit(30).exec(); // 데이터 부하 테스트로 limit를 걸어본다. 19.09.02. 오. 속도가 훨~씬 빨라진다. 일단 이렇게 잡아놓고 나중에 옵션으로 전체 검색 넣자.
      // console.log('gameList.length: '+gameList.length);
      res.json(gameList);

    } else if (page.category == 2) { // 팀페이지 보여주기
      // 오늘 날짜 이후의 게임 중에 page.id가 있는 팀의 목록을 모두 불러온다
      const f = {
        $or: [{ homeTeam_id: page.id }, { awayTeam_id: page.id }],
        event_date: { '$gte': dt }
      };
      const s = { event_date: 1 };

      const gameList = await DB_gameInfo.find(f).sort(s).exec();
      // console.log('gameList.length: ' + gameList.length);
      res.json(gameList);

    } else if (page.category == 3) { // hot games 페이지
      try {
        const dt = new Date();
        let f = { event_date: { '$gte': dt }, open_status: 3, hot_game: true }; // 오늘 이후의 open된 게임들만 정리해서
        const s = { event_date: 1 };
        // const l = 10;
        const hotCheckedGames = await DB_gameInfo.find(f).sort(s).exec();

        // 오늘 이후 베팅가능한 인기팀들만 뽑는다.
        const teams = [40, 50, 47, 33, 42, 49, 529, 530, 541];
        f = { $or: [{ homeTeam_id: { $in: teams } }, { awayTeam_id: { $in: teams } }], event_date: { '$gte': dt }, open_status: 3 };
        const hotTeamList = await DB_gameInfo.find(f).sort(s).exec();
        const sumCheckedAndTeams = hotCheckedGames.concat(hotTeamList); // checked와 team 목록을 합친후
        // 아래와 같이 해당 object의 fixture_id의 값이 중복되는 것들을 제거한다.
        const checkedAndTeams = utils.getUniqueObjArr(sumCheckedAndTeams, 'fixture_id');

        // 모든 게임들을 최신순으로 정렬한 후 모두 뽑는다.
        f = { event_date: { '$gte': dt }, open_status: 3 };
        const allGameList = await DB_gameInfo.find(f).sort(s).exec();
        const sumAll = checkedAndTeams.concat(allGameList);
        const hotGameList = utils.getUniqueObjArr(sumAll, 'fixture_id');

        utils.timeChk(dt);
        res.json(hotGameList);

      } catch {
        res.status(400).end();
      }

    } else if (page.category == 4) { // In-Play Matches page
      const f = { open_status: 4 };
      const s = { event_date: -1 };
      const gameList = await DB_gameInfo.find(f).sort(s).exec();

      res.json(gameList);
    } else if (page.category == 5) { // Finished Matches page
      const f = { open_status: 5 };
      const s = { event_date: -1 };

      const gameList = await DB_gameInfo.find(f).sort(s).exec();
      res.json(gameList);

    } else if (page.category == 6) { // Player Rank page. main.js에서 그대로 가져옴
      try {
        const f = {}
        const s = { createdAt: -1 };

        // 아래부터 주석을 풀면 30일짜리가 들어간다.
        function set_date(howPeriod) {
          const dt = new Date();
          const thisYear = dt.getFullYear();
          const thisMonth = dt.getMonth();
          const today = dt.getDate();
          const theDay = new Date(thisYear, thisMonth, today - howPeriod);
          f.createdAt = { '$gte': theDay, '$lte': dt };
        }

        // 누적. 모든 정보를 가져온 후 => 나중에 하나하나 쿼리로 바꾸자
        // const allBet = await DB_betInfo.find(f).sort(s).populate('fixture_Obj_id').exec();
        const allBet = await DB_betInfo.find(f).sort(s).exec();
        // set_date(30); // 30일간 데이터 가져오기
        // const allBet30 = await DB_betInfo.find(f).sort(s).populate('fixture_Obj_id').exec();
        const betInfo = exeAllBet(allBet);
        // const betInfo30 = exeAllBet(allBet30);

        function exeAllBet(totalBet) {
          const userArr = new Array(); // 유저당 배팅액

          totalBet.map((bet, idx) => {
            const userIdx = userArr.findIndex(el => el.user == bet.user); // 유저당
            if (userIdx == -1) { userArr.push({ user: bet.user, totalStake: bet.stake, totalReturn: bet.returnEth || 0, totalBetCount: 1, }); }// 만약 유저가 없다면 push
            else { // 배열안에 기존 유저가 있다면
              userArr[userIdx].totalStake += bet.stake;
              userArr[userIdx].totalReturn += bet.returnEth || 0;
              userArr[userIdx].totalBetCount++;
            }
          })
          return userArr;
        }
        betInfo.splice(5); // 5개만 넘겨준다
        // res.json({ betInfo: betInfo, betInfo30: betInfo30, allBet: allBet })
        res.json(betInfo);
      } catch (err) {
        console.log(err);
        res.status(400).end();
      }

    }
  } catch {
    res.status(400).end(); // 400 Bad Request
  }

})


module.exports = route;