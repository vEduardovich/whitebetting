const express        = require('express');
const get_ip         = require('ipware')().get_ip;
const route          = express.Router();
const DB_data        = require('../models/data'); // 베팅 정보

// 만약 카운트만 올리거나 줄이고 싶다면 아래 문서와 같이 $inc 를 사용하면 된다.
// https://docs.mongodb.com/manual/reference/operator/update/inc/
route.get('/pushData', (req, res) => {
  const { what } = req.query;
  const ipAddress = get_ip(req).clientIp;
  const parsedIpAddr = ipAddress.slice(0, 7);
  const myIps = ['::1', '118.36.186.224', '119.196.15.217', '106.242.225.2', '222.110.133.193', '121.134.241.197', '66.249.65.187', '74.125.150.25'];
  const slicedMyIps = myIps.map(el => el.slice(0, 7));
  const idx = slicedMyIps.findIndex(myIp => myIp == parsedIpAddr);
  if(idx > -1){
    res.status(200).end();
    return;
  }
  try{
    new DB_data({
      what      : what,
      createdAt : Date.now()
    }).save();
    res.status(200).end();
  } catch(err){ 
    console.log(err);
    res.status(202).end();
  }
})

module.exports = route;