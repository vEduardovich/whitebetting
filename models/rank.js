const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);

// 랭킹을 여기에 넣자
const rankSchema = new Schema({
  createdAt : { type: Date },
  userRank  : { type: Array },
});

rankSchema.plugin(autoIncrement, { inc_field: 'rank_num' });
const rank = mongoose.model('rank', rankSchema);
module.exports = rank;