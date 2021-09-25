const _ = require('underscore');
const req = require('./req');
const request = require('superagent');

describe('test req', ()=>{
	it('test jest mock',async ()=>{
		// console.log(request);
		// console.log(request.get.toString());
		// console.log(request.toString());
		// console.log(request.Request.toString());
		// console.log(request.Request.prototype);
		// console.log(request.Request.prototype.query.toString());

		// let spy = jest.spyOn(request.Request.prototype,'query');
		// spy.mockResolvedValue({status:'mocked'});

		request.Request.prototype.query = jest.fn(()=>Promise.resolve({status:'mocked'}));


		let res = await req.get('http://www.baidu.com');
		// console.log(_.keys(res));
		// console.log(res.status);
	});
});