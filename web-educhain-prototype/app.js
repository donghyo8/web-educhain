'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
var express = require('express');
var session = require('express-session');
var expressLayouts = require('express-ejs-layouts');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var util = require('util');
var app = express();
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');
var cors = require('cors');
require('./config.js');
var hfc = require('fabric-client');
var host = process.env.HOST || hfc.getConfigSetting('host');
var port = process.env.PORT || hfc.getConfigSetting('port');
var mysqlDB = require('./config/db');
mysqlDB.connect();

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SET CONFIGURATONS ////////////////////////////
///////////////////////////////////////////////////////////////////////////////

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('./public'));
app.options('*', cors());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

// ------- Create Session -------
var createSession = function createSession() {
	return function (req, res, next) {
		if (!req.session.login) {
			req.session.login = 'logout';
		}
		next();
	};
};
app.use(session({
	secret: '1234DSFs@adf1234!@#$asd',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 6000000 },
}));
app.use(createSession());

// ------- Set Routers -------
var mainRouter = require('./routes/index.js')(app);
var userRouter = require('./routes/user.js')(app);
var productRouter = require('./routes/product.js')(app);
var requestRouter = require('./routes/request.js')(app);
var itemsRouter = require('./routes/items.js')(app);

app.use('/', mainRouter);
app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/request', requestRouter);
app.use('/items', itemsRouter);


///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(port, function() {});

logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************',host,port);
server.timeout = 240000;
