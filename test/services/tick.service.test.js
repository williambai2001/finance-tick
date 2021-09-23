const _ = require('underscore');
const moment = require('moment');
const {ServiceBroker} = require('moleculer');
const TickServiceSchema = require('../../src/services/tick.service');

describe('tick.service',()=>{
	let broker = new ServiceBroker({logger: false});
	let tickService = broker.createService(TickServiceSchema);
	jest.setTimeout(30000);
	beforeAll(()=>broker.start());
	afterAll(()=>broker.stop());

	describe('.actions',()=>{
		it('.get()',async ()=>{
			const tick = await broker.call('Tick.get');
			console.log(`tick: ${tick}`);
			expect(tick).toBeInstanceOf(Object);
		});
		it('.getAll()',async ()=>{

		});
	});
	xdescribe('.methods',()=>{
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
