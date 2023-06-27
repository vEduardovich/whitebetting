const http         = require('http');
const express      = require('express');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
// const session   = require('express-session');
const cors         = require('cors'); // local cross browsing을 위해 꼭 필요하다. Vue포트에 붙어야 하니까.
const app          = express();
const server       = http.createServer(app);
const history      = require('connect-history-api-fallback');
// const connect      = require('connect');
require('./commons/db');
const config       = require('./commons/config');

// passport적용으로 connect-mongo사용 중지
// const MongoStore 		= require('connect-mongo')(session);
// process.env.NODE_ENV = config.mode;
process.env.NODE_ENV = config.mode;
app.use(history());
app.use(express.static('public'));
app.use(bodyParser.json({ limit: '50mb', extended: true }));// support parsing of application/json type post data
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // application/x-www-form-urlencoded
// app.use(session(config.session));
app.use(cookieParser(config.cookie.key));
app.use(cors());//cors('http://localhost:3000') 처럼 주소를 넣으면 해당 주소만 허용한다

app.locals.pretty = true;

// app.use('/apis', require('./api/apis'));
app.use('/apis/comment', require('./apis/comment'));
app.use('/apis/data', require('./apis/data'));
app.use('/apis/football', require('./apis/football')); // Football.vue에서 사용하는 methods
app.use('/apis/user', require('./apis/user'));
app.use('/apis/list', require('./apis/list'));
app.use('/apis/main', require('./apis/main'));
app.use('/sign', require('./apis/sign'));
// app.all('*', (req, res) => {	res.render('default'); });

app.set('port', process.env.PORT || config.port);
server.listen(app.get('port'), (err) => {
  console.log(`Connected Server 127.0.0.1:${app.get('port')}`);
})