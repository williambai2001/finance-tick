const _ = require('underscore');
const {ServiceBroker} = require('moleculer');
const DbService = require('moleculer-db');
const SqlAdapter = require('moleculer-db-adapter-sequelize');
const Sequelize = require("sequelize");
//** 配置文件存入process.env中
const {} = require('../src/helpers/dotenv');


DbService.adapter = new SqlAdapter(process.env.DB_DATABASE,process.env.DB_USER,process.env.DB_PASS,{
	dialect: 'mysql',
	pool: {
		min: 0,
		max: 50,
		idle: 10000,
	}
});

const broker = new ServiceBroker({
	namespace: 'development',
	nodeID: `db-service-${process.pid}`,
	transporter: 'TCP',
});

broker.createService({
	name: 'SymbolDAO',
	mixins: [DbService],
	model: require('../src/sql_schemas/symbol.schema'),
});

broker.createService({
	name: 'CategoryDAO',
	mixins: [DbService],
	model: require('../src/sql_schemas/category.schema'),
});

broker.createService({
	name: 'SymbolCategoryDAO',
	mixins: [DbService],
	model: require('../src/sql_schemas/symbol.category.schema'),
});

broker.createService({
	name: 'Min5DAO',
	mixins: [DbService],
	model: require('../src/sql_schemas/min5.schema'),
});

broker.createService({
	name: 'Min30DAO',
	mixins: [DbService],
	model: require('../src/sql_schemas/min30.schema'),
});

broker.createService({
	name: 'DailyDAO',
	mixins: [DbService],
	model: require('../src/sql_schemas/daily.schema'),
});

broker.start()
	// .then(()=>broker.call('SymbolDAO.create',{symbol:'sh000001',name:'sh000001'}))
	// .then(()=>broker.call('CategoryDAO.create',{name:'category1',description:'desc1'}))
	.then(()=>broker.call('Min5DAO.create',{symbol:'sh000001',time:'2021-01-01 09:30:00',open:123,close:124,high:125,low:122,volume:123456}))
	.then(()=>broker.call('Min5DAO.create',{symbol:'sh000001',time:'2021-01-01 09:35:00',open:123,close:124,high:125,low:122,volume:123456}))
	.then(broker.repl());




