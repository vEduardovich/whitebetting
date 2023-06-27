const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);

// 배팅률 가져오기
const standingsSchema = new Schema({
  createdAt       : { type: Date, default: Date.now() },
  league_id       : { type: Number },
  rankArr         : { type: Array },// 여기안에 순서대로 배열에 쭉 넣자
});

standingsSchema.plugin(autoIncrement, { inc_field: 'standings_num' });
const standings = mongoose.model('standings', standingsSchema);
module.exports = standings;
