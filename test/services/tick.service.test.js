const _ = require('underscore');
const moment = require('moment');
const {ServiceBroker} = require('moleculer');
const TickServiceSchema = require('../../src/services/tick.service');

describe('tick.service',()=>{
	let broker = new ServiceBroker({logger: false});
	let tickService = broker.createService(TickServiceSchema);

	describe('.actions',()=>{
		jest.setTimeout(30000);
		beforeAll(()=>broker.start());
		afterAll(()=>broker.stop());
		it('.get()',async ()=>{
			const tick = await broker.call('Tick.get');
			// console.log(`tick:`, tick);
			expect(tick).toBeInstanceOf(Object);
		});
		it('.getAll()',async ()=>{
			const ticks = await broker.call('Tick.getAll');
			// console.log(`ticks:`, ticks);
			expect(ticks).toBeInstanceOf(Array);

		});
	});
	describe('.methods',()=>{
		it('.requestTick()',async ()=>{
			let symbols = ['sh000001'];
			let tick = await tickService.requestTick(symbols).catch(console.error);
			// console.log(tick);
			expect(tick).toBeInstanceOf(Object);
			expect(tick).toHaveProperty(symbols[0]);
			expect(tick[symbols[0]]).toHaveProperty('symbol');
			expect(tick[symbols[0]]).toHaveProperty('name');
			expect(tick[symbols[0]]).toHaveProperty('date');
			expect(tick[symbols[0]]).toHaveProperty('time');
		});
	});
});
