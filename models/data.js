const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);

// 베팅정보
const dataSchema = new Schema({
  what: { type: Number },
  ip: { type: String },
  createdAt: { type: Date },
});

dataSchema.plugin(autoIncrement, { inc_field: 'data_num' });

const data = mongoose.model('data', dataSchema);
module.exports = data;

// this.dataAnalysis(21012);
// * 페이지 진입 확인
// 20001 : Main page 진입
// 20002 : Game page 진입
// 20003 : User page 진입
// 20004 : Comment page 진입
// 20005 : Hot matches page
// 20006 : In-Play Matches
// 20007 : Finished Matches
// 20008 : Player Rank
// 20009 : Latest Bets
// 20010 : EPL
// 20011 : La Liga
// 20012 : Bundesliga
// 20013 : Serie A
// 20014 : France Lique1
// 20015 : UEFA Champions League
// 20016 : Europa League
// 20017 : Euro Championship
// 20100 : How to bet
// 20101 : Announcements
// 20102 : About wB
// 20103 : Contract us
// 20104 : Diary
// 20105 : Terms of service
// * 팀 페이지 번호
// 21001 : Liverpool
// 21002 : manCity
// 21003 : tottenham
// 21004 : manUnited
// 21005 : arsenal
// 21006 : chelsea
// 21007 : barcelona
// 21008 : atletico
// 21009 : realMadrid
// 21010 : munich
// 21011 : juventus
// 21012 : parisSaintGermain
// * 특정 경기 page 진입
// 1000000000 + 경기 번호 
// 예를들어 157268 경기인경우
// 1000157268 : fixture_id: 157268 인 경기페이지 진입


// 1000: 게임화면
// 1001: 최상단 telegram link, 1002: twitter, 1003: facebook link
// 1010: 게임 정보 새로 고침
// 1101: 1은 homeTeam, 2는 drawTeam, 3은 awayTeam, 4는 over, 5는 under, 6은 homeTeamAndDraw, 7은 homeAndAwayTeam, 8은 awayTeamAndDraw, 0은 항상null
// 1201: 게임 보상완료 etherscan에서 보기
// 1202: trust wallet 열기 클릭
// 1203: MetaMask 를 열기 링크 클릭
// 1204: All 버튼 클릭
// 1205: MY BETS 버튼 클릭
// 1301: Match Statistics - Guardian 기사 링크
// 1302: Match Statistics - Youtube 링크 클릭
// 1310: Betting History - Player 링크 클릭
// 1311: Betting History - Txhash 링크 클릭
// 1312: Betting History - Return Tx 링크 클릭
// 1321: 게임내 Comments 새로고침 클릭
// 1322: 코멘츠 페이지 내 Comments 새로고침 클릭
// 1323: 게임내 user nickname 클릭

// * PC & Mobile 베팅 버튼(공통)
// 1501: Please log in to MetaMask. confirm 클릭했을때
// 1502: Your bet has been canceled. Play again 클릭했을 때
// 1503: 베팅 최종 완료. close버튼 클릭했을 때
// 1504: 베팅 최종 완료. etherscan에서 최종완성 tx확인 클릭했을 때
// 1510: 보상금액 초과로 베팅이 불가능한 게임. play again 눌렀을 때
// 1511: Odd가 변경되어 베팅 불가능한 게임. Page reload 눌렀을 때
// 1521: 베팅 팝업창. Min 버튼 클릭
// 1522: 베팅 팝업창. +0.05 버튼 클릭
// 1523: 베팅 팝업창. +0.50 버튼 클릭
// 1524: 베팅 팝업창. Max 버튼 클릭
// 1525: 베팅 팝업창. - 버튼 클릭
// 1526: 베팅 팝업창. + 버튼 클릭
// 1527: 베팅 팝업창. Close X버튼 클릭
// 1: 베팅 팝업창. PlaceBet 클릭


// 2100: 메인 상단의 Announcements link
// 2200: 메인 Hot Matches link
// 2201 ~ 2010 : 메임 Hot Matches 1등부터 10등까지 클릭
// 2300: 메인 Comment link
// 2301: 메인 Comment link - user nickname
// 2302: 메인 Comment link - game link
// 2400 : Hot Teams 12개. 나중에 Hot Teams를 클릭하면 모든 팀 정보가 뜨도록 만들자
// 2401 : 리버풀, 2402: 맨시티, 2403: 토트넘, 2404: 맨체스터 유나이티드, 2405: 아스날, 2406: 첼시, 2407: 바르셀로나, 2408: 아틀렌티코, 2409: 레알마드리드, 2410: 뭰휀, 2411: 유벤투스, 2412: 파리생제르망
// 2500 : 메인 In-play Match // 2501 ~ 2505 : 메인의 5개 경기
// 2600 : 메인 Finished Matches // 2601 ~ 2605 
// 2700 : 메인 Player Rank. 01~05
// 2800 : 메인 Latest Bets. 01~-05

// 3100 : hot matches 내부 페이지
// 3200 : 모든 리그 내부 페이지 
// 4100 : In-Play Matches 내부 페이지 새로고침, 4101 : 내부 페이지 경기 클릭 (2500내부에 4100)
// 4200 : Finished Matches 내부 페이지 새로고침, 4201 : 내부 페이지 경기 클릭 (즉 2600내부에 4200)
// 4301 : User페이지. game 정보 클릭
// 4302 : User페이지. Txhash 정보 클릭

// 5001 : Hot Matches 내부 클릭 (2200, 11201를 통해 들어왔을 때 내부 클릭 5000). 경기 번호는 1000개 부여. 즉 5001~ 5999까지 내부 경기번호
// 6101 : EPL (11301을 통해 들어옴)
// 6102 : Laliga (11302)
// 6103 : Bundesliga (11303)
// 6104 : SerieA (11304)
// 6105 : France Lique1 (11305)
// 6106 : UEFA Champions (11306)
// 6107 : UEFA Europa (11307)
// 6108 : Euro Championship (11308)

// 6201 : 리버풀(2401), 6202 : 맨시티(2402), 6203 : 토트넘(2403), 6203 : 토트넘(2403), 6204 : 맨유(2404), 6205 : 아스날(2405), 6206 : 첼시(2406), 6207 : 바르셀로나(2407), 6208 : 아틀렌티코(2408), 6209 : 레알마드리드(2409), 6210 : 뭰휀(2410), 6211 : 유벤투스(2411), 6212 : 파리생제르망(2412) // 팀 내부 클릭은 순서 상관없이 모두 같은 번호로 처리

// 6300 : Player Rank. 6300은 1등 클릭, 6399은 100등 클릭
// 6401 : Latest Bets 내부에서 Game을 클릭했을 때, 6402는 트랜잭션을 클릭했을 때


// 11100 : 네비바(상단+좌측) draw버튼. 삼선 버튼
// 11101 : 상단 WhiteBetting 메인 아이콘, 11102: telegram, 11103: 내페이지
// 11201 : 좌측 draw의 hot matches, 11301~ : 리그 아이콘. 11301 EPL부터~ , 11401: 코멘트 게시판

// 12101 : Footer - how to bet, 12002: Announcements, 12003: About wB, 12004:Contract us, 12005: Diary, 12006: Terms of service
// 12201 : Fotter -DappRadar, 12202: Dapp.com, 12203: StateOfTheDapps, 12204: Etherscan