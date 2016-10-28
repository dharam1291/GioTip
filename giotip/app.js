
/**
 * Module dependencies.
 */

var express = require('express')
  , configFile = require('./routes/config')
  , home = require('./routes/home')
  , geotip = require('./routes/giotip')
  , citylist = require('./routes/citylist')
  , cityplace = require('./routes/cityplace')
  , giopoint = require('./routes/giopoint')
  , errorpage = require('./routes/error')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.get('/', home.homepage);
app.get('/giotip',geotip.giopage);
app.get('/citylist',citylist.getlist);
app.get('/cityplace',cityplace.getlist);
app.get('/error',errorpage.rendererror);
app.get('/giopoint',giopoint.getlist);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
