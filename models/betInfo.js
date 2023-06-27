const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);
const gameInfo      = require('./gameInfo');

// 베팅정보
const betInfoSchema = new Schema({
  fixture_id     : { type: Number },
  fixture_Obj_id : { type: mongoose.Schema.Types.ObjectId, index: 'hashed', ref: 'gameInfo' }, // gameInfo의 _id를 저장한다.
  createdAt      : { type: Date, default: Date.now() },
  
  user           : { type: String },
  isMobile       : { type: Boolean },
  ip_address     : { type: String },
  selectedTeam   : { type: Number }, // 1: homeTeam, 2: drawTeam, 3: awayTeam, 4: over, 5: under, 6:homeTeamAndDraw, 7: homeAndAwayTeam, 8: awayTeamAndDraw

  teamName       : { type: String },
  stake          : { type: Number },
  odd            : { type: Number },

  market         : { type: String }, // 게임방식

  // confirm이 된후
  transaction    : { type: String },
  isTxCertain    : { type: Boolean, default: false },// tx 인증된거?
  returnEth      : { type: Number }, // 보상 받은 ETH
  reward_tx      : { type: String }, // 서버에서 유저에게 보상 날린 tx
  reward_date    : { type: Date },   // 보상 완료 시간
});

betInfoSchema.plugin( autoIncrement , { inc_field : 'betInfo_num' } );
const betInfo = mongoose.model('betInfo', betInfoSchema);
module.exports = betInfo;
