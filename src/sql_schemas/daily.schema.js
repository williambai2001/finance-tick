const Sequelize = require("sequelize");

module.exports = {
	name: 'daily',
	define: {
		symbol: Sequelize.STRING,
		time: Sequelize.STRING,
		open: Sequelize.STRING,
		close: Sequelize.STRING,
		high: Sequelize.STRING,
		low: Sequelize.STRING,
		volume: Sequelize.STRING,
	},
	options: {
		tableName: 'daily',
	}
};