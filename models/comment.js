const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const autoIncrement = require('mongoose-sequence')(mongoose);
const userAccount   = require('./userAccount');
const gameInfo			= require('./gameInfo');

// comment DB
const commentSchema = new Schema({
	createdAt      : { type: Date, default: Date.now() },
  isMobile       : { type: Boolean, default: true },// 화면이 1200보다 작으면 모바일
	category       : { type: Number },// 1이면 게임게시판, 10은 자유게시판
	fixture_id     : { type: Number },
	fixture_Obj_id : { type: mongoose.Schema.Types.ObjectId, index: 'hashed', ref: 'gameInfo' }, // gameInfo의 _id를 저장한다.
		
  isDeleted      : { type: Boolean, default: false },//글이 삭제된 경우 보여주지 않는다.

	// main_comment_id: { type: mongoose.Schema.Types.ObjectId, index: 'hashed' },//게시판 번호. 답글일 경우 여기에 메인글의 id가 들어간다.
	sub_comment_arr : { type: Array },// 답글들이 배열로 들어간다.

	user           : { type: String, },// 로그인되었다면 계정주소 아니라면 messi, honaldo도 처럼 자동으로 붙이기
	nickname			 : { type: String, },// nickname 넣어야할 것 같다
	avatar_num		 : { type: Number, },// Random Character Index
	
	user_Obj_id		 : { type: mongoose.Schema.Types.ObjectId, index: 'hashed', ref: 'userAccount'}, // gameInfo의 _id를 저장한다.
	article        : { type: String },// 코멘트 글
	ex_article		 : { type: String },// 삭제된 코멘트 백업
  count          : { type: Number },// 조회수. 나중을 위해 넣어놓는다
	score					 : 
	{
		good: Array, 		
		bad: Array, // score는 일단 무한으로 누른수 있고 +,-를 sum해서 보여주기
	},
	// 공지사항. true면 메인화면과 Comments화면 최상단에 고정. 켜고 끄는 건 admin에서 하자
	notice				 : { type: Boolean, default: false },
});

commentSchema.plugin(autoIncrement, { inc_field: 'comment_num' } );
const comment = mongoose.model('comment', commentSchema);
module.exports = comment;
