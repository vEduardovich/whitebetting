const express        = require('express');
const route          = express.Router();
const DB_comment     = require('../models/comment');// 순위정보

route.get('/count', async (req, res) => {
  const totalCount = await DB_comment.countDocuments();
  res.json(totalCount);
})

// 게임정보 가져오기
route.get('/more', async (req, res) => {
  const { pageNum } = req.query;
  const sort = { createdAt: -1 };
  const l = 20;
  const skip = 20 * (pageNum - 1);

  const select = { createdAt: 1, category: 1, fixture_id: 1, fixture_Obj_id: 1, sub_comment_arr: 1, user: 1, avatar_num: 1, article: 1, count: 1, score: 1, user_Obj_id: 1, isDeleted: 1, };
  const selectTeam = { "odd.homeTeam": 1, "odd.drawTeam": 1, "odd.awayTeam": 1, "odd.homeTeamAndDraw": 1, "odd.homeAndAwayTeam": 1, "odd.awayTeamAndDraw": 1, "odd.under": 1, "odd.over": 1 };
  // 아래와 같이 2번 populate()하면 각각 정보를 구할 수 있다
  const comments = await DB_comment.find().sort(sort).limit(l).skip(skip).select(select).lean().populate('fixture_Obj_id', 'event_date league_id round homeTeam awayTeam status odd').populate('user_Obj_id', 'stat.white').exec();
  res.json(comments);
})

// 게임정보 가져오기
route.get('/all', async (req, res) => {
  const { pageNum } = req.query;
  const sort = { createdAt: -1 };
  const l = 20;
  const skip = 20 * (pageNum -1);
  
  const select = { createdAt: 1, category: 1, fixture_id: 1, fixture_Obj_id: 1, sub_comment_arr: 1, user: 1, avatar_num: 1, article: 1, count: 1, score: 1, user_Obj_id: 1, isDeleted: 1, notice:1 }; 
  const selectTeam = { "odd.homeTeam": 1, "odd.drawTeam": 1, "odd.awayTeam": 1, "odd.homeTeamAndDraw": 1, "odd.homeAndAwayTeam": 1, "odd.awayTeamAndDraw": 1, "odd.under": 1, "odd.over": 1 };
  // 아래와 같이 2번 populate()하면 각각 정보를 구할 수 있다
  const comments = await DB_comment.find().sort(sort).limit(l).skip(skip).select(select).lean().populate('fixture_Obj_id', 'event_date league_id round homeTeam awayTeam status odd').populate('user_Obj_id', 'stat.white').exec();
  res.json(comments);
})

module.exports = route;