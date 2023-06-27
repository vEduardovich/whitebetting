import axios from 'axios';

class Sign{
  constructor(){
    this.baseURL = (process.env.NODE_ENV == 'development') ? 'http://localhost:10001' : '';
  }

  // 로그인하기
  async setSignIn(userAccount, isMobile){
    return new Promise(async (resolve, reject) => {
      try{
        const res = await axios( {
          method  : 'post',
          baseURL : this.baseURL,
          url     : '/sign/in',
          data    : { user: userAccount, isMobile : isMobile },
        });
        resolve(res.data);

      } catch (err) { console.log(err); reject(err); }
    })
  }
}

export default Sign;