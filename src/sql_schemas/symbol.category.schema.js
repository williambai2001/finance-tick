const {Sequelize,DataTypes} = require('sequelize');

module.exports = {
	name: 'symbol_category',
	define:{
		id: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		symbol_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		category_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	options: {
		tableName: 'symbol_category',
		engine: 'innodb',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
		createdAt: true,
		updatedAt: true,
		indexs: [{fields:['symbol_id']},{fields:['category_id']}],
	},
};