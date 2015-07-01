var expect = require('chai').expect;
var data = require('../routes/data.js');

describe("Mobile data collector", function(){
  it("should contain a key called postData", function(done){
    expect(data).to.include.keys('postData');
    done();
  });

  it("should return a status error if body of req is empty or missing info", function(done){
    var res = {
      num: 200,
      status: function(status) {
        this.num = status;
        return this;
      },
      json: function(obj) {
        return obj;
      }
    };
    expect(data.postData({},res)).to.have.property('error', true);
    done();
  });
});