const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);

// 배팅률 가져오기
const gameInfoSchema = new Schema({
  fixture_id      : { type: Number, index: 'hashed' },
  createdAt       : { type: Date, default: Date.now() },
  updatedAt       : { type: Date },

  event_timestamp : { type: Number },
  event_date      : { type: Date },
  event_localDate : { type: String },
  league_id       : { type: Number },
  league          : { name: String, country: String },
  venue           : { type: String},
  round           : { type: String },

  homeTeam_id     : { type: Number },
  awayTeam_id     : { type: Number },
  homeTeam        : { type: String },
  awayTeam        : { type: String },

  status          : { type: String },
  statusShort     : { type: String },
  goalsHomeTeam   : { type: Number },
  goalsAwayTeam   : { type: Number },
  score           : { halftime : String,
                      fulltime : String,
                      extratime : String,
                      penalty : String },
  elapsed         : { type: Number },
  firstHalfStart  : { type: Number },
  secondHalfStart : { type: Number },
  open_status     : { type: Number },  // 2:pending, 3:open, 4:playing, 5:returned, 6: 경기종료. 보상 대기중, 8: 10 mins before play, 9: waiting to open, 10:disuse, 
  hot_game        : { type: Boolean }, // true: hot game, false: not
  caution         : { type: Boolean }, // 만약 open된 게임의 timestamp가 변경되었다면 true가 된다.
  reward_tx       : { type: String }, // 보상처리를 한 transaction// 이제 사용하지 않는다 200310
  reward_date     : { type: Date }, // 보상이 모두 완료되면 해당 시간이 저장된다


// 현재 배당률
  odd        : {
    updateAt : Date,

    //승무패
    homeTeam : Number,
    drawTeam : Number,
    awayTeam : Number,

    //더블찬스
    homeTeamAndDraw : Number,
    homeAndAwayTeam : Number,
    awayTeamAndDraw : Number,

    // 언더오버
    under : Number,
    over  : Number,

    //모든 배팅률. 모든 배팅률 정보 다 넣는다. 나중에 유용하게 쓸지 모른다.
    total : Object,
  },
  // football api에서 가져온 배당률
  pre_odd: {
    updateAt: Date,

    //승무패
    homeTeam: Number,
    drawTeam: Number,
    awayTeam: Number,

    //더블찬스
    homeTeamAndDraw: Number,
    homeAndAwayTeam: Number,
    awayTeamAndDraw: Number,

    // 언더오버
    under: Number,
    over: Number,

    //모든 배팅률. 모든 배팅률 정보 다 넣는다. 나중에 유용하게 쓸지 모른다.
    total: Object,
  },
  
  // 경기 스탯
  stat: { home: Object, away: Object, h2h: Array },
  media: {
    youtube: [{ publishedAt: Date, id: String, title: String, description: String, thumbnails: String }]
  },

});

gameInfoSchema.plugin(autoIncrement, { inc_field: 'gameInfo_num' });
const gameInfo = mongoose.model('gameInfo', gameInfoSchema);
module.exports = gameInfo;
