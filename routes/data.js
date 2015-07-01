//object to hold the functions used in the router
var exports = {};
var config = require('config');//setup file for the db. 

exports.postData = function(req, res) {
  //all of the req.body stuff are sent as part of the post req.
  if (!req.body.time || !req.body.gps || !req.body.id) {
    return res.status(400).json({error: true});
  }
  var time = req.body.time;
  var gps = req.body.gps;
  var accel = req.body.accel;
  var phone_id = req.body.id;
  var sql = 'INSERT INTO `mobile_data` (`timestamp`, `lat`, `lon`, `ax`, `ay`, `az`, `phone_id`) VALUES ';
  var latlng, as, t;
  while (gps.length!==0 || accel.length!==0) { //Create the sql query by hand so that we only have to make one. 
    if (gps.length==1 || accel.length ==1) {
      latlng = gps.pop();
      as = accel.pop();
      t = time.pop();
      sql += '('+t+','+latlng[0]+','+latlng[1]+','+as[0]+','+as[1]+','+as[2]+','+phone_id+')';
    }
    latlng = gps.pop();
    as = accel.pop();
    t = time.pop();
    sql += '('+t+','+latlng[0]+','+latlng[1]+','+as[0]+','+as[1]+','+as[2]+','+phone_id+'),';
  }
  //the sql query
  config.db.query(sql, data, function(err, result){
    if (err) { //handle errors
      console.log('DB ERROR (mobile_data): ', err);
      return res.status(400).json({error: true});
    }
    return res.status(200).json({success: true});
  });
};

//make the object available.
module.exports = exports;