const Sequelize = require("sequelize");

module.exports = {
	name: 'symbol',
	define: {
		symbol: Sequelize.STRING,
		name: Sequelize.STRING,
		description: Sequelize.STRING,
	},
	options: {
		tableName: 'symbol',
	}
};