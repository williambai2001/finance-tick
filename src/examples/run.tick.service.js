const path = require('path');
const { ServiceBroker } = require('moleculer');

const broker = new ServiceBroker({
	namespace: 'development',
	nodeID: 'tick-service',

	logger: {
		type: 'Console',
		options: {
			level: 'info',
			colors: true,
			formatter: 'full',
		},
	},

});

broker.loadService(path.join(__dirname,'../services/tick.service.js'));

broker.start();
broker.repl();
