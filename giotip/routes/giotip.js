exports.giopage = function(req, res){
    var getlocationId = req.query.searchlocation; 
    res.render('dashboard',{selectedcityId:getlocationId});
};