const path = require('path');
const { ServiceBroker } = require('moleculer');

const broker = new ServiceBroker({
	namespace: 'development',
	nodeID: `minute-service-${process.pid}`,
	transporter: 'TCP',
	logger: {
		type: 'Console',
		options: {
			level: 'info',
			colors: true,
			formatter: 'full',
		},
	},
});

broker.loadService(path.join(__dirname,'../src/services/minute.service.js'));

broker.start();
broker.repl();
