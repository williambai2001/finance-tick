const _ = require('underscore');
const moment = require('moment');
const TickFunc = require('../../src/funcs/tick.func');

describe('tick.func.',()=>{

	it('.dailyIgnore()',()=>{
		expect(TickFunc).toHaveProperty('getHolidays');
		let holidays = TickFunc.getHolidays();
		expect(holidays).toBeInstanceOf(Array);
		let holiday = holidays[0] || '2021-01-01';
		expect(TickFunc).toHaveProperty('dailyIgnore');
		let success = TickFunc.dailyIgnore(holiday);
		expect(success).toBe(true);
		let failure = TickFunc.dailyIgnore('2021-01-10');
		expect(failure).toBe(false);
	});

	it('.timeIgnore()',()=>{
		// console.log(moment.fn);
		expect(TickFunc).toHaveProperty('timeIgnore');
		let times = ['09:30:00','11:30:00','13:00:00','15:00:00'];
		_.each(times,(time)=>{
			expect(TickFunc.timeIgnore(time)).toBe(true);
		});
		let failures = ['09:30:01','11:29:59','13:00:01','14:59:59'];
		_.each(failures,(failure)=>{
			expect(TickFunc.timeIgnore(failure)).toBe(false);
		});
	});
});
