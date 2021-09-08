const _ = require('underscore');
const moment = require('moment');
const TickService = require('../../src/services/tick.service');

describe('tick.service.',()=>{

	xit('.methods.dailyIgnore()',()=>{
		expect(TickService).toHaveProperty('methods');
		let methods = TickService.methods;
		expect(TickService.methods).toHaveProperty('getHolidays');
		let holidays = methods.getHolidays();
		expect(holidays).toBeInstanceOf(Array);
		let holiday = holidays[0] || '2021-01-01';
		expect(TickService.methods).toHaveProperty('dailyIgnore');
		let success = methods.dailyIgnore(holiday);
		expect(success).toBe(true);
		let failure = methods.dailyIgnore('2021-01-10');
		expect(failure).toBe(false);
	});

	xit('.methods.timeIgnore()',()=>{
		// console.log(moment.fn);
		expect(TickService).toHaveProperty('methods');
		let methods = TickService.methods;
		expect(TickService.methods).toHaveProperty('timeIgnore');
		let times = ['09:30:00','11:30:00','13:00:00','15:00:00'];
		_.each(times,(time)=>{
			expect(methods.timeIgnore(time)).toBe(true);
		});
		let failures = ['09:30:01','11:29:59','13:00:01','14:59:59'];
		_.each(failures,(failure)=>{
			expect(methods.timeIgnore(failure)).toBe(false);
		});
	});

	it('.methods.requestTick()',async ()=>{
		expect(TickService).toHaveProperty('methods');
		let methods = TickService.methods;
		expect(TickService.methods).toHaveProperty('requestTick');
		let symbols = ['sh000001'];
		let tick = await methods.requestTick(symbols);
		// console.log(tick);
		expect(tick).toBeInstanceOf(Object);
		expect(tick).toHaveProperty(symbols[0]);
		expect(tick[symbols[0]]).toHaveProperty('symbol');
		expect(tick[symbols[0]]).toHaveProperty('name');
		expect(tick[symbols[0]]).toHaveProperty('date');
		expect(tick[symbols[0]]).toHaveProperty('time');
	});
});
