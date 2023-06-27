const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

// 유저 계정
const userAccountSchema = new Schema({
  user            : { type: String, index: 'hashed' },
  createdAt       : { type: Date   },
  isMobile        : { type: Boolean },

  // nickname: { type: String, index: { unique: true } }, // 주소를 대체할 닉네임. 나중에 적용할지 말지;
  // profile_img     : { type: String }, // 프로필 이미지 주소

  avatar         : { type: String },// 아바타 이미지 주소. 이것도 메시, 호날도처럼 임의의 것을 넣어주자
  stat            : { white: Number, returnEth : Number, count : Number }, // 통계로 보여주기 위해

  signIn          : [{
    at            : { type: Date   }, // 로그인한 시간 
    isMobile      : { type: Boolean },// true면 모바일
  }],
});


const userAccount = mongoose.model('userAccount', userAccountSchema);
module.exports = userAccount;
