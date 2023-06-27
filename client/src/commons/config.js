module.exports = {
  mode : 'development',
  // mode : 'production',
  port : 10001, // server port
  apis : {
    localBaseURL  : 'http://localhost:10001',
    setSingIn     : '/sign/in', // 유저 로그인 정보 저장
  },
}