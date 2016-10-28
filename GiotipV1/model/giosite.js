var configFile = require('../configuration/config');
var mysql = require('mysql');
exports.getlist = function(req,res){
		var cityid = req.query.cityid;
		var db = configFile.db;
		var giositeList = [];
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
			var query = connection.query("SELECT * from giosite WHERE cityid=?",[cityid],function(err,rows,fields){
				if(err){
				return;
				}
				rows.forEach(function(item){
					/*sync function*/
					var buffer = new Buffer(item.img );
					var bufferBase64 = buffer.toString('base64');
					giositeList.push({
						"name":item.name,
						"giositeid":item.giositeid,
						"descp":item.description,
						"image":bufferBase64,
						"contact":item.contact,
						"lat":item.lat,
						"lng":item.lng
					});
				});
				res.send(giositeList);
			});
			connection.end(function(err){
				if(err){
					return;
				}
			});
		});
};