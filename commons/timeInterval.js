// 이 파일에는 특정한 시간 간격으로 계속 수행해야하는 작업들을 넣는다.

const rp            = require('request-promise');
// const schedule      = require('node-schedule') // 스케쥴에 맞춰 실행시키는 모듈
const config        = require('./config.js');

const DB_oddInfo   = require('../models/oddInfo');//배팅률 정보
const DB_gameInfo  = require('../models/gameInfo');//게임 정보

const gameDate = '2019-02-19';//게임이 열리는 날짜
const fixture_id = 65909;// 나중에 배열로 한번에 넣는 것도 고민하자.
const reqOptions = {
  method: 'get',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/525.13 (KHTML, like Gecko) Chrome/0.2.149.29 Safari/525.13',
    'X-Mashape-Key': config.api_football.key,
    'Accept': 'application/json',
  },
}

// 함수 실행
// 게임이 끝난 후에는 가져오기를 중지하는 것도 만든다.
exports.dbSetting = () => {
  // getGameInfo( fixture_id, reqOptions, gameDate );
  // getOddInfo( fixture_id, reqOptions );
  // setInterval(getOddInfo, 60 * 60 * 1 * 2 * 1000); // 2시간마다 한번
  // setInterval(getGameInfo, 60 * 60 * 24 * 1000); // 24시간마다 한번
}

// 배팅률 가져오기
function getOddInfo(){
  const getOdds   = `https://api-football-v1.p.mashape.com/odds/${fixture_id}`;
  reqOptions.url  = getOdds;

  console.log(getOdds);
  rp(reqOptions)
    .then( jsonCode => {
      const result = JSON.parse(jsonCode);

      const winTheMathch = new Object();
      const doubleChance = new Object();
      const underOver    = new Object();
      const underOver1_5 = new Object();
      const underOver0_5 = new Object();
      const total_odd    = result.api.odds;//모든 배팅률 정보 다 넣는다.

      if (result.api.odds["Win the match"]){
        winTheMathch.homeTeam_odd = parseFloat(result.api.odds["Win the match"]["1"].odd).toFixed(2);
        winTheMathch.awayTeam_odd = parseFloat(result.api.odds["Win the match"]["2"].odd).toFixed(2);
        winTheMathch.drawTeam_odd = parseFloat(result.api.odds["Win the match"]["N"].odd).toFixed(2);
      }
      if (result.api.odds["Double chance"]){
        doubleChance.homeTeamAndDraw_odd = parseFloat(result.api.odds["Double chance"]["1/N"].odd).toFixed(2);
        doubleChance.awayTeamAndDraw_odd = parseFloat(result.api.odds["Double chance"]["N/2"].odd).toFixed(2);
        doubleChance.hameAndAwayTeam_odd = parseFloat(result.api.odds["Double chance"]["1/2"].odd).toFixed(2);
      }
      if (result.api.odds["Over/Under MT 2,5 goals"]){
        underOver.over_odd  = parseFloat(result.api.odds["Over/Under MT 2,5 goals"]["Over 2,5"].odd).toFixed(2);
        underOver.under_odd = parseFloat(result.api.odds["Over/Under MT 2,5 goals"]["Under 2,5"].odd).toFixed(2);
      }

      if (result.api.odds["Over/Under HT 1.5 goal"]){
        underOver1_5.over_odd  = parseFloat(result.api.odds["Over/Under HT 1.5 goal"]["Over 1,5"].odd).toFixed(2);
        underOver1_5.under_odd = parseFloat(result.api.odds["Over/Under HT 1.5 goal"]["Under 1,5"].odd).toFixed(2);
        // .(dot)은 mongodb에 넣을 수 없기에 아래처럼 저장한다.
        total_odd.underOver1_5 = underOver1_5;
        delete total_odd["Over/Under HT 1.5 goal"];
      }

      if (result.api.odds["Over/Under HT 0.5 goal"]){
        underOver0_5.over_odd  = parseFloat(result.api.odds["Over/Under HT 0.5 goal"]["Over 0,5"].odd).toFixed(2);
        underOver0_5.under_odd = parseFloat(result.api.odds["Over/Under HT 0.5 goal"]["Under 0,5"].odd).toFixed(2);
        total_odd.underOver0_5 = underOver0_5;
        delete total_odd["Over/Under HT 0.5 goal"];
      }

      new DB_oddInfo({
        fixture_id      : fixture_id,
        createdAt       : Date.now(),
        createdAt_local : new Date().toLocaleString(),

        //승무패
        homeTeam_odd    : winTheMathch.homeTeam_odd,
        awayTeam_odd    : winTheMathch.awayTeam_odd,
        drawTeam_odd    : winTheMathch.drawTeam_odd,

        //더블찬스
        homeTeamAndDraw_odd : doubleChance.homeTeamAndDraw_odd,
        awayTeamAndDraw_odd : doubleChance.awayTeamAndDraw_odd,
        hameAndAwayTeam_odd : doubleChance.hameAndAwayTeam_odd,

        //언더오버 2.5
        over_odd        : underOver.over_odd,
        under_odd       : underOver.under_odd,

        //모든 배팅률
        total_odd       : total_odd,

      }).save( err => err ? console.log(err) : err );

    })
    .catch( (err)=>{
      console.log('odds 접속 오류');
      console.log(err);
    })
}

// 게임정보 가져오기
function getGameInfo(){
  const getGameInfo = `https://api-football-v1.p.mashape.com/fixtures/date/${gameDate}`;
  // ASIAN cup 
  // const getGameInfo = `https://api-football-v1.p.mashape.com/fixtures/league/195`;
  reqOptions.url    = getGameInfo;

  rp(reqOptions)
    .then( jsonCode => {
      const result = JSON.parse(jsonCode);
      const matchTime = new Date(result.api.fixtures[fixture_id].event_date);
      // 아래 db저장도 나중에 if문으로 예외처리 하자.
      new DB_gameInfo({
        fixture_id      : fixture_id,
        createdAt       : Date.now(),
        createdAt_local : new Date().toLocaleString(),
    
        event_timestamp : parseInt(result.api.fixtures[fixture_id].event_timestamp),
        event_date      : matchTime,//현지 시간
        event_localDate : matchTime.toLocaleString(),//한국 시간
        league_id       : parseInt(result.api.fixtures[fixture_id].league_id),
        round           : result.api.fixtures[fixture_id].round,
        homeTeam_id     : parseInt(result.api.fixtures[fixture_id].homeTeam_id),
        awayTeam_id     : parseInt(result.api.fixtures[fixture_id].awayTeam_id),
        homeTeam        : result.api.fixtures[fixture_id].homeTeam,
        awayTeam        : result.api.fixtures[fixture_id].awayTeam,
        status          : result.api.fixtures[fixture_id].status,
        statusShort     : result.api.fixtures[fixture_id].statusShort,
        goalsHomeTeam   : parseInt(result.api.fixtures[fixture_id].goalsHomeTeam) || '',
        goalsAwayTeam   : parseInt(result.api.fixtures[fixture_id].goalsAwayTeam) || '',
        halftime_score  : result.api.fixtures[fixture_id].halftime_score || '',
        final_score     : result.api.fixtures[fixture_id].final_score || '',
        penalty         : result.api.fixtures[fixture_id].penalty || '',
        elapsed         : parseInt(result.api.fixtures[fixture_id].elapsed),
        firstHalfStart  : parseInt(result.api.fixtures[fixture_id].firstHalfStart),
        secondHalfStart : parseInt(result.api.fixtures[fixture_id].secondHalfStart),
      }).save( err => err ? console.log(err) : err );

    })
    .catch( (err)=>{
      console.log('odds 접속 오류');
      console.log(err);
    })  

}


// 맨유와 리버플이 싸울 모든 경기 알아내기. 아래처럼 id를 두개 적어준다.
// https://api-football-v1.p.mashape.com/fixtures/h2h/40/33