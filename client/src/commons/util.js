import sign from '@/commons/sign';
const Sign = new sign();

class Util {
  constructor() {
    this.baseURL = (process.env.NODE_ENV == 'development') ? 'http://localhost:10001' : '';
    this.isMobile    = (window.innerWidth < 1264) ? true : false;
  }

  getLeagueName(name) {
    switch (name) {
      case "Primera Division": return "Primera";
      case "Bundesliga 1": return "Bundesliga";
      case "Premier League": return "PL";
      case "Serie A": return "Serie A";
      case "Ligue 1": return "Ligue 1";
      case "Champions": return "Champions League";
      case "Europa": return "Europa League";
      case "Euro": return "Euro Championship";
    }
  }
  
  async checkSession(session, userAccount) {
    if (!session.exists()) { // 세션이 없다면
      if (userAccount) {
        session.destroy(); // 이전 세션 정리한 후
        session.start(); // 세션 시작
        const userObj_id = await Sign.setSignIn(userAccount, this.isMobile); // DB에 로그인 처리
        session.set('user', userAccount);
        return userObj_id;
      }
    } else {// 세션이 있다면
      if (userAccount){
        const prevAccount = session.get('user'); // session에 저장된 user는 이전 유저다
        if ( userAccount != prevAccount ){ // 세션이 있긴한데 이전 유저와 현재 유저가 다르다면
          const userObj_id = await Sign.setSignIn(userAccount, this.isMobile); // DB에 로그인 처리
          session.set('user', userAccount); // 새로운 유저로 로그인
          return userObj_id;
        }
      } else{// 그러나 userAccount가 없다면 세션 파괴
        session.destroy(); // 세션 파괴
      }
    }
  }

  // t1에 Date.now()를 미리 넣고 그 후 완료된 시점에 timeChk(t1)를 실행하면 걸린 시간을 알려준다
  timeChk(t1) {
    const t2 = Date.now();
    let t3 = (t2 - t1) / 1000;
    if (t3 >= 60) {
      const tVal = t3 / 60;
      const tRest = t3 % 60;
      t3 = tVal.toFixed(0) + '분 ' + tRest.toFixed(2) + '초';
    } else {
      t3 = t3.toFixed(2) + '초';
    }
  }  


  // 랜덤 수 만들기
  randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // UID 만들기
  uid(strLen) {
    let strUID = new String;
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    while (strLen > 0) {
      strUID += alphabet.charAt(this.randRange(0, alphabet.length - 1));
      strLen--
    }
    return strUID;
  }

}

export default Util;