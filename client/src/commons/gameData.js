const GameData = {
  announcements : [
    {
      id: 1,
      message: "Ethereum Mainnet is now very unstable! [ Mar 12, 2020 ]",
      content(createElement, content) {
        return createElement('router-link', {
          props: { to: '/info/announcements', },
          class: 'router-link-exact-active router-link-active grey--text text--darken-1',
        }, content.message);
      },
    }, 
 
  ],
  mainPageTeamIcons : [
    { id: 40, name: 'liverpool', fullName: 'Liverpool FC' },
    { id: 50, name: 'manCity', fullName: 'Manchester City FC' },
    { id: 47, name: 'tottenham', fullName: 'Tottenham Hotspur FC' },
    { id: 33, name: 'manUnited', fullName: 'Manchester United FC' },
    { id: 42, name: 'arsenal', fullName: 'Arsenal FC' },
    { id: 49, name: 'chelsea', fullName: 'Chelsea FC' },
    { id: 529, name: 'barcelona', fullName: 'Futbol Club Barcelona' },
    { id: 530, name: 'atletico', fullName: 'Club Atlético de Madrid' },
    { id: 541, name: 'realMadrid', fullName: 'Real Madrid Club de Fútbol' },    
    { id: 157, name: 'munich', fullName: 'FC Bayern München' },    
    { id: 496, name: 'juventus', fullName: 'Juventus FC' },    
    { id: 85, name: 'parisSaintGermain', fullName: 'Paris Saint-Germain FC' },    
  ],
  league : [
    { id: 524, flagId: 2, name: 'epl', fullName: 'England Premier League' }, // "2019-08-09"
    { id: 775, flagId: 87, name: 'laliga', fullName: 'La Liga Primera Division' }, // 2019-08-16"
    { id: 530, flagId: 132, name: 'champions', fullName: 'UEFA Champions League' }, // "2019-06-25"
    { id: 754, flagId: 8, name: 'bundesliga', fullName: 'Bundesliga' }, // "2019-08-16"
    { id: 891, flagId: 94, name: 'serieA', fullName: 'Serie A' }, // "2019-08-24",
    { id: 525, flagId: 4, name: 'ligue1', fullName: 'France Lique1' }, // "2019-08-09"
    { id: 403, flagId: 403, name: 'euro', fullName: 'Euro Championship' }, // "2019-03-21",
    { id: 514, flagId: 137, name: 'europa', fullName: 'Europa League' }, // "2019-06-27",    
    { id: 758, flagId: 758, name: 'faCup', fullName: 'FA Cup' }, // "2018-11-09",    
  ],
  mainToolbarLists: [
    { title: 'Hot Matches', icon: 'fa fa-soccer-ball-o', src: 'https://whitebetting.s3.amazonaws.com/game/logo/favicon.png', size: '32px', ml: 'ml-1', route: '/group/hotgames' },
  ], 

  communitinesToolbarLists: [
    { title: 'Hot Comments', icon: 'chat', size: 'font-size:26px;margin-left:7px;color:#C2185B;', route: '/hotcomments' },
  ],   

  leagueToolbarLists: [
    { title: 'England Premier League', icon: 'fa fa-soccer-ball-o ', src: 'https://whitebetting.s3.amazonaws.com/league/icons/2.png', size: '32px', ml: 'ml-1', route: '/group/epl' },
    { title: 'La Liga Primera Division', icon: 'fa fa-soccer-ball-o', src: 'https://whitebetting.s3.amazonaws.com/league/icons/87.png', size: '24px', ml: 'ml-2', route: '/group/laliga' },
    { title: 'Bundesliga', icon: 'fa fa-soccer-ball-o', src: 'https://whitebetting.s3.amazonaws.com/league/icons/8.png', size: '30px', ml: 'ml-1', route: '/group/bundesliga' },
    { title: 'Serie A', icon: 'fa fa-soccer-ball-o', src: 'https://whitebetting.s3.amazonaws.com/league/icons/94.png', size: '35px', ml: 'ml-0', route: '/group/serieA' },
    { title: 'France Lique1', icon: 'fa fa-soccer-ball-o', src: 'https://whitebetting.s3.amazonaws.com/league/icons/4.png', size: '30px', ml: 'ml-1', route: '/group/ligue1' },
    { title: 'UEFA Champions League', icon: 'fa fa-soccer-ball-o', src: 'https://whitebetting.s3.amazonaws.com/league/icons/132.png', size: '35px', ml: 'ml-0', route: '/group/champions' },
    { title: 'Europa League', icon: 'fa fa-soccer-ball-o', src: 'https://whitebetting.s3.amazonaws.com/league/icons/137.png', size: '30px', ml: 'ml-1', route: '/group/europa' },
    { title: 'Euro Championship', icon: 'fa fa-soccer-ball-o', src: 'https://whitebetting.s3.amazonaws.com/league/icons/403.png', size: '30px', ml: 'ml-1', route: '/group/euro' },
    // { title: 'FA Cup'   , icon: 'fa fa-soccer-ball-o'     , src:'https://whitebetting.s3.amazonaws.com/league/icons/758.png', size:'20px', ml:'ml-2', route: '/group/faCup' },
  ],

  team : [
    { id: 40, name: 'liverpool', fullName: 'Liverpool Football Club' },
    { id: 50, name: 'manCity',   fullName: 'Manchester City FC' },
    { id: 47, name: 'tottenham', fullName: 'Tottenham Hotspur FC' },
    { id: 33, name: 'manUnited', fullName: 'Manchester United FC' },
    { id: 42, name: 'arsenal', fullName: 'Arsenal Football Club' },
    { id: 49, name: 'chelsea', fullName: 'Chelsea Football Club' },
    { id: 529, name: 'barcelona', fullName: 'Futbol Club Barcelona' },
    { id: 530, name: 'atletico', fullName: 'Club Atlético de Madrid' },
    { id: 541, name: 'realMadrid', fullName: 'Real Madrid Club de Fútbol' },    
    { id: 157, name: 'munich', fullName: 'FC Bayern München' },
    { id: 496, name: 'juventus', fullName: 'Juventus FC' },
    { id: 85, name: 'parisSaintGermain', fullName: 'Paris Saint-Germain FC' },      
  ],
  gameHeader : [
    { text: 'No.', align: 'center', sortable: true, value: 'number', hide: 'xs' },
    { text: 'HOME', align: 'center', sortable: false, value: 'homeTeam' },
    { text: 'vs', align: 'center', sortable: false, value: 'drawTeam' },
    { text: 'AWAY', align: 'center', sortable: false, value: 'awayTeam' },
    { text: 'League', align: 'center', sortable: false, value: 'league', hide: 'xs' },
    // { text: 'Over', align: 'center', sortable: false, value: 'over', hide: 'xs' },
    // { text: 'Under', align: 'center', sortable: false, value: 'under', hide: 'xs' },
    { text: 'Start Time', align: 'center', sortable: false, value: 'event_date_fromNow' },
        // { text: 'Status', align: 'center', sortable: false, value: 'status', hide: 'xs'   },
      ],  
  listGameHeader: [
    { text: 'No.', align: 'center', sortable: true, value: 'number', hide: 'xs' },
    { text: 'HOME', align: 'center', sortable: false, value: 'homeTeam' },
    { text: 'vs', align: 'center', sortable: false, value: 'drawTeam' },
    { text: 'AWAY', align: 'center', sortable: false, value: 'awayTeam' },
    { text: 'Over', align: 'center', sortable: false, value: 'over', hide: 'xs' },
    { text: 'Under', align: 'center', sortable: false, value: 'under', hide: 'xs' },
    { text: 'League', align: 'center', sortable: false, value: 'league', hide: 'xs' },
    { text: 'Start Time', align: 'center', sortable: false, value: 'event_date_fromNow' },
    // { text: 'Status', align: 'center', sortable: false, value: 'status', hide: 'xs'   },
  ],  
  MatchListHeader: [
    { text: 'No.', align: 'center', sortable: true, value: 'number', hide: 'xs' },
    { text: 'HOME', align: 'center', sortable: false, value: 'homeTeam' },
    { text: 'Score', align: 'center', sortable: false, value: '' },
    { text: 'AWAY', align: 'center', sortable: false, value: 'awayTeam' },
    { text: 'League', align: 'center', sortable: false, value: 'over', hide: 'xs' },
    { text: 'Round', align: 'center', sortable: false, value: 'over', hide: 'xs' },
    { text: 'Start Time', align: 'center', sortable: false, value: 'event_date_fromNow' },
  ],         
  userRankHeaders: [
    { text: 'Rank', align: 'center', sortable: false, value: 'number' },
    { text: 'Player', align: 'center', sortable: false, value: 'user' },
    { text: 'Stakes', align: 'center', sortable: true, value: 'totalStake' },
    { text: 'Returns', align: 'center', sortable: true, value: 'totalReturn' },
  ],
  betHeaders: [
    { text: 'No.', align: 'center', sortable: true, value: 'number' },
    { text: 'Created', align: 'center', sortable: false, value: 'event_date', hide: 'xs' },
    { text: 'Start Time', align: 'center', sortable: false, value: 'event_date_moment', hide: 'xs' },
    { text: 'Match', align: 'center', sortable: false, value: 'match', hide: 'xs' },
    { text: 'Bet', align: 'center', sortable: false, value: 'teamName' },
    { text: 'Stake', align: 'center', sortable: false, value: 'stake', },
    { text: 'Odd', align: 'center', sortable: false, value: 'odd', hide: 'xs' },
    { text: 'Market', align: 'center', sortable: false, value: 'market', hide: 'mdAndDown' },
    { text: 'Returns', align: 'center', sortable: false, value: 'returnEth', },
  ],
  fakeUser: ['Robertson', 'Griezmann', 'Ronaldo', 'Silva', 'Hazard', 'Pique', 'Kane', 'Son', 'Vardy', 'Benzema', 'Kevin', 'Mbappe', 'Messi', 'Suarez','Mané','Rashford','Salah','Neymar','Dybala','Aubameyang','Sterling','Lewandowski','Lukaku','Aguero','Ramos','Arnold','Virgil','Silva', ],  
}

export default GameData;
