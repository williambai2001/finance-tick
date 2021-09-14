const {Sequelize,DataTypes} = require("sequelize");

module.exports = {
	name: 'symbol',
	define: {
		id: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		// id: {
		// 	type: DataTypes.BIGINT(11),
		// 	autoIncrement: true,
		// 	primaryKey: true,
		// },
		symbol: {
			type: DataTypes.STRING(10),
			allowNull: false,
			unique: true,
		},
		name: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT('tiny'),
		},
		status: {
			type: DataTypes.ENUM,
			values: ['disable','enable','deleted'],
			defaultValue: 'enable',
		},
	},
	options: {
		tableName: 'symbol',
		engine: 'innodb',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
		timestamps: true,
		createdAt: true,
		updatedAt: true,
		indexes: [{name:'symbol_status',fields:['symbol','status']}],
	},
};