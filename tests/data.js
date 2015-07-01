var expect = require('chai').expect;
var data = require('../routes/data.js');

describe("Mobile data collector", function(){
  it("should contain a key called postData", function(done){
    expect(data).to.include.keys('postData');
    done();
  });
});