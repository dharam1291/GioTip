var configFile = require('../configuration/config');
var mysql = require('mysql');
exports.getlist = function(req,res){
var db = configFile.db;
var cityList = [];
var connection = mysql.createConnection(
	       {
		      host     : db.host,
		      user     : db.user,
		      password : db.password,
		      database : db.database,
		    });
connection.connect(function(err){
	if(err){
		return res.status(404).send();
	}
	/*** now execute query*/
	var query = connection.query("SELECT * from city",function(err,rows,fields){
		if(err){
			return res.status(404).send();
		    }
		rows.forEach(function(item){
			//synchronous 
			var buffer = new Buffer(item.img );
			var bufferBase64 = buffer.toString('base64');
			cityList.push({
				"name":item.cityname,
				"image":bufferBase64,
				"cityid":item.cityid,
				"lat":item.lat,
				"lng":item.lng
				});
		});
		res.status(200).send(cityList);
		});
	connection.end(function(err){
		if(err){
			return res.status(404).send();
		}
	});
});	
};