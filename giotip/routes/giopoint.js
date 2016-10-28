var configFile = require('./config');
var mysql = require('mysql');
exports.getlist = function(req,res){
var db = configFile.db;
var giositeid = req.query.giositeid;
var giopoint = [];
var connection = mysql.createConnection(
	       {
		      host     : db.host,
		      user     : db.user,
		      password : db.password,
		      database : db.database,
		    });
connection.connect(function(err){
	if(err){
		return;
	}
	/*** now execute query*/
	var query = connection.query("SELECT * from giopoint WHERE giositeid=?",[giositeid],function(err,rows,fields){
		if(err){
			return;
		    }
		rows.forEach(function(item){
			//synchronous 
			var buffer = new Buffer(item.image );
			var bufferBase64 = buffer.toString('base64');
			giopoint.push({
				"name":item.name,
				"image":bufferBase64,
				"lat":item.lat,
				"lng":item.lng
				});
		});
		res.send(giopoint);
		});
	connection.end(function(err){
		if(err){
			return;
		}
	});
});	
};