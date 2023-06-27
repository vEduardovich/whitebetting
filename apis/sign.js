const express        = require('express');
const route          = express.Router();
const request        = require('request-promise');
const utils          = require('../commons/utils.js');
const DB_userAccount = require('../models/userAccount');

route.post('/in', async (req, res) => {
  const user      = req.body.user;
  const isMobile  = req.body.isMobile;
  const dateNow   = Date.now();

  let userAccount;
  const selectUser = { user:0, isMobile:0, createdAt:0 };
  try{
    userAccount = await DB_userAccount.findOne({ user: user }).select(selectUser);
  } catch (err) {
    console.log(err);
  }

  if(!userAccount){ // userAccount가 없다면 새로 만든다.
    // 슬랙에 새유저 push 하기
    const slackUrl = `slackUrl`;

    slackExe(slackUrl, isMobile, user);

    try{
      const newUser = new DB_userAccount ({
        user          : user,
        isMobile      : isMobile,
        createdAt     : dateNow,
        signIn        : [ { at : dateNow, isMobile : isMobile }],
        stat          : { white: 0 }
        // signIn        : ;[ { at : dateNow, isMobile : isMobile }],
      }).save();
      res.json(newUser._id)
    } catch(err){ console.log(err); res.status(202).end(); }
  } else {
    // 유저 재방문! 아래 webHook은 wb가 아닌 incoming web hook token이다. 
    // 새로운 알림 추가시 토큰 새로 만드는 건 아직 찾지못했다. 200108
    const slackUrl = `slackUrl`;
    slackExe(slackUrl, isMobile, user);

    userAccount.signIn.push({ at: dateNow, isMobile: isMobile });
    userAccount.markModified('signIn');
    userAccount.save();
    res.json(userAccount._id)
  }

  function slackExe(slackUrl, isMobile, user){
    try {
      request.post({
        url: slackUrl,
        headers: { 'Content-Type': 'application/json' },
        json: {
          text: `
Date        : ${utils.getWhen('txtDate')}
IsMobile    : ${isMobile}
user        : ${user}
        `
        },
      });
    } catch (err) {
      console.log(err);
    }    
  }
})


module.exports = route;