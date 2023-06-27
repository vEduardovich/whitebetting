const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);

// 유저 계정
const dummySchema = new Schema({
  address       : { type: String, index: 'hashed' },
  privateKey    : { type: String },
  createdAt     : { type: Date   },
  eth           : { type: Number },
  betCount      : { type: Number },
  isUse         : { type: Boolean },
});

dummySchema.plugin(autoIncrement, { inc_field: 'dummy_num' });
const dummy = mongoose.model('dummy', dummySchema);
module.exports = dummy;
