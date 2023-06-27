const sha256        = require('sha256'); // 암호화 sha256 사용
const ip            = require('ip');

// 중복되는 Object array 해결 (중복해결을 원하는 obj, 중복체크할 key)
exports.getUniqueObjArr = (arr, key)=>{
	return arr.filter((v1, i) => {
		return arr.findIndex((v2, j) => {
			return v1[key] === v2[key];
		}) === i;
	});	
}

// 랜덤 수 만들기
exports.randRange = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 날짜 차이 구하기. 매년 1월 1일부터 계산한 날짜수.
exports.term = (studyDay) => {
	const thisYear  = new Date().getFullYear();
	const firstDay  = new Date ( thisYear, 0, 1 ) ;
	const term    = Math.ceil((studyDay - firstDay) / ( 60 * 60 * 24 * 1000 ));
	return term;
}

// UID 만들기
exports.uid = (strLen)=> {
	let strUID = new String;
	let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	while (strLen > 0) {
		strUID += alphabet.charAt(exports.randRange(0, alphabet.length - 1));
		strLen--
	}
	return strUID;
}

exports.sha256 = sha256;

// 날짜구하기 모듈, 형식 '16-11-20 (오전 2:19)'
// settingTime값이
// txtDate 라면 txtWhen(게시판 날짜 표시)
// numDate 라면 numWhen() '16-11-20 (14:19)'
// dbDate 라면 dbWhen(db덤프만들때 폴더이름에 들어가는 용도) 형식은 16.11.26_11h17m
// strDate 라면 170206 클라에서 날짜를 비교해 뿌져주기 위한 용도
// strDateTxt 라면 17.02.06 Mon.
exports.getWhen = (settingTime, dt = new Date()) => {
	// let dt          = new Date();
	let year        = dt.getFullYear() % 100; // 뒤에 2자리만 구하기위해
	let month       = dt.getMonth() + 1;
	let day         = dt.getDate();
	let monthEng    = '';
	switch(month){
		case 1 :  monthEng = 'Jan'; break;
		case 2 :  monthEng = 'Feb'; break;
		case 3 :  monthEng = 'Mar'; break;
		case 4 :  monthEng = 'Apr'; break;
		case 5 :  monthEng = 'May'; break;
		case 6 :  monthEng = 'Jun'; break;
		case 7 :  monthEng = 'Jul'; break;
		case 8 :  monthEng = 'Aug'; break;
		case 9 :  monthEng = 'Sep'; break;
		case 10:  monthEng = 'Oct'; break;
		case 11:  monthEng = 'Nov'; break;
		case 12:  monthEng = 'Dec'; break;
	}
	month < 10 ? month = '0' + month.toString() : month = month.toString();
	day < 10 ?   day = '0' + day.toString()     : day = day.toString();
	let fullDate    = year.toString() + '.' + month.toString() + '.' + day.toString();
	let hour        = dt.getHours();
	let min         = dt.getMinutes();
	min < 10 ? min  = '0' + min.toString() : min = min.toString();
	let sec         = dt.getSeconds();
	let fullTime    = hour + ':' + min.toString();
	let fullTimeEnglish = hour + 'h' + min.toString() + 'm' + sec.toString(); // DB백업용 폴더이름
	let nowDay = dt.getDay(); // 요일 확인. 일요일 0, 월요일 1, ..., 토요일 6
	switch (nowDay) {
		case 0 : nowDay = 'Sun.'; break;
		case 1 : nowDay = 'Mon.'; break;
		case 2 : nowDay = 'Tue.'; break;
		case 3 : nowDay = 'Wed.'; break;
		case 4 : nowDay = 'Thu.'; break;
		case 5 : nowDay = 'Fri.'; break;
		case 6 : nowDay = 'Sat.'; break;
	}

	if (hour >= 12) {
		hour != 12 ? hour -= 12 : hour; // 12시는 오후로 표시하기위해
		hour = '오후 ' + hour.toString();
	} else {
		hour = '오전 ' + hour.toString();
	}
	let txtNum      = fullDate + ' (' + hour + ':' + min.toString() + ')';
	let numWhen     = fullDate + ' (' + fullTime + ')';
	let dbWhen      = fullDate + '_' + fullTimeEnglish; // DB백업용 폴더이름
	let strDate     = year.toString() + month.toString() + day.toString(); // 170206
	let strDateTxt  = day.toString() + '-' + monthEng + '-' + dt.getFullYear().toString() + ' ' + nowDay; // 05-Mar-2017
	switch (settingTime) {
		case 'numDate'      : return numWhen;
		case 'txtDate'      : return txtNum;
		case 'dbDate'       : return dbWhen;
		case 'strDate'      : return parseInt(strDate);
		case 'strDateTxt'   : return strDateTxt;
		default             : return Date.now();
	}
}

// 쿠키 만들기
// exports.makeMaxAge = (expiredDay) => {
//     var dt = new Date();
//     dt.setTime(dt.getTime() + (expiredDay * 24 * 60 * 60 * 1000));
//     return dt.toUTCString();
// }

// 지난 날짜에 따라 게시판 글에 New 아이콘 붙이기
exports.makeNewIcon = (item, day) => {
	var nowDate = Date.now();
	if ((nowDate - item.updatedAt) < 1000 * 60 * 60 * 24 * day) {
		return true;
	}
}

// 배열에 clean() 메서드 추가. 만약 clean('')와 같이 사용할 경우 배열내 ''값은 모두 제거된다.
Array.prototype.clean = function (deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};

// t1에 Date.now()를 미리 넣고 그 후 완료된 시점에 timeChk(t1)를 실행하면 걸린 시간을 알려준다
exports.timeChk = (t1) => {
	const t2 = Date.now();
	let t3 = (t2 - t1) / 1000;
	if (t3 >= 60) {
		const tVal = t3 / 60;
		const tRest = t3 % 60;
		t3 = tVal.toFixed(0) + '분 ' + tRest.toFixed(2) + '초';
	} else {
		t3 = t3.toFixed(2) + '초';
	}
	console.log('걸린 시간 : ' + t3);
}  

// 숫자에 comma 찍기
exports.pickComma = (num)=> {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
