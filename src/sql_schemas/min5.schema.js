const {Sequelize,DataTypes} = require("sequelize");

module.exports = {
	name: 'min5',
	define: {
		id: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		symbol: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		time: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		open: {
			type: DataTypes.FLOAT,
			defaultValue: 0,
		},
		close: {
			type: DataTypes.FLOAT,
			defaultValue: 0,
		},
		high: {
			type: DataTypes.FLOAT,
			defaultValue: 0,
		},
		low: {
			type: DataTypes.FLOAT,
			defaultValue: 0,
		},
		volume: {
			type: DataTypes.FLOAT,
			defaultValue: 0,
		},
	},
	options: {
		tableName: 'min5',
		engine: 'innodb',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
		timestamps: true,
		createdAt: true,
		updatedAt: true,
		indexes: [{name:'symbol_time',fields:['symbol','time']}],
	}
};

