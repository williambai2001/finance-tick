const _ = require('underscore');
const moment = require('moment');
const TickService = require('../../src/services/tick.service');

describe('tick.service.',()=>{

	it('.requestTick()',async ()=>{
		expect(TickService).toHaveProperty('methods');
		let methods = TickService.methods;
		expect(methods).toHaveProperty('requestTick');
		let symbols = ['sh000001'];
		let tick = await methods.requestTick(symbols);
		expect(tick).toBeInstanceOf(Object);
		expect(tick).toHaveProperty(symbols[0]);
		expect(tick[symbols[0]]).toHaveProperty('symbol');
		expect(tick[symbols[0]]).toHaveProperty('name');
		expect(tick[symbols[0]]).toHaveProperty('date');
		expect(tick[symbols[0]]).toHaveProperty('time');
	});
});
