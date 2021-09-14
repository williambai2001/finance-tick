const {Sequelize,DataTypes} = require('sequelize');

module.exports = {
	name: 'category',
	define:{
		id: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			defaultValue: '',
		},
	},
	options: {
		tableName: 'category',
		engine: 'innodb',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
		createdAt: true,
		updatedAt: true,
		indexs: [{name:'category_name',fields:['name']}],
	},
};