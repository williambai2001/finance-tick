const quote = require('../../src/funcs/quote.126.net.func');

describe('quote 126.net',()=>{
	it('.getDailyClose()',async ()=>{
		expect(quote.getDailyClose()).rejects.toMatch(/wrong/);
		expect(quote.getDailyClose('000001')).rejects.toMatch(/wrong/);
		expect(quote.getDailyClose('sh00001')).rejects.toHaveProperty('status');

		var dailyClose = await quote.getDailyClose('sh000001').catch(console.error);
		// console.log(dailyClose);
	});
});