const _ = require('underscore');
const {ServiceBroker} = require('moleculer');
const DbService = require('moleculer-db');
const SqlAdapter = require('moleculer-db-adapter-sequelize');
const Sequelize = require("sequelize");

DbService.adapter = new SqlAdapter('test','root','123456',{
	dialect: 'mysql',
	pool: {
		min: 0,
		max: 5,
		idle: 10000,
	}
});

const broker = new ServiceBroker();

broker.createService({
	name: 'Symbol',
	mixins: [DbService],
	model: require('../src/sql_schemas/symbol.schema'),
});

broker.createService({
	name: 'Min5',
	mixins: [DbService],
	model: require('../src/sql_schemas/min5.schema'),
});

broker.createService({
	name: 'Min30',
	mixins: [DbService],
	model: require('../src/sql_schemas/min30.schema'),
});

broker.createService({
	name: 'Daily',
	mixins: [DbService],
	model: require('../src/sql_schemas/daily.schema'),
});

broker.start()
	.then(()=>broker.call('Min5.create',{symbol:'sh000001',time:'2021-01-01 09:30:00',open:123,close:124,high:125,low:122,volume:123456}))
	.then(()=>broker.call('Min5.create',{symbol:'sh000001',time:'2021-01-01 09:35:00',open:123,close:124,high:125,low:122,volume:123456}))
	.then(broker.repl());




