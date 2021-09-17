const path = require('path');
const fs = require('fs');
const moment = require('moment');
const _ = require('underscore');
const {} = require('../helpers/dotenv');
const methods = require('../mixins/methods');

module.exports = exports = {
	name: 'Minute',

	// dependencies: [
	// 	'Tick',
	// ],
	mixins: [methods],
	hooks: {
	},
	actions: {
		get5: {
			params: {
				symbol: {
					type: 'string',
					options: {
						min: 6,
						max: 8,
					},
				}
			},
			handler(ctx){

			},
		},
		get30: {
			params: {
				symbol: {
					type: 'string',
					optoins: {
						min: 6,
						max: 8,
					},
				}
			},
			handler(ctx){

			},
		},
		get60: {
			params: {
				symbol: {
					type: 'string',
					optoins: {
						min: 6,
						max: 8,
					},
				}
			},
			handler(ctx){

			},
		},
	},
	events: {
		'tick.updated': {
			handler(other){
				this.logger.info('tick is updated.');
				this.logger.info(other);
			},
		},
	},
	methods: {
		update5(){

		},
		update30(){

		},

	},
	created(){
		this.loop_time = (new Date).getTime();
		this.loop_interval = 30000;
		this.interval_instance = null;
		this.blacklist = [];
	},
	started(){

		//** periodic process
		let deltaTime = (((new Date).getTime() - this.loop_time)/1000).toFixed(0);
		this.interval_instance = setInterval(async ()=>{
			let today = moment().format('YYYY-MM-DD');
			if(this.dailyIgnore(today)){
				this.logger.warn(`WARNING: ${today} is holiday.`);
				return;
			}
			let time = moment().format('HH:mm:ss');
			if(this.timeIgnore(time)){
				this.logger.warn(`WARNING: ${time} is not trade time.`);
				return;
			}
			this.loop_time = (new Date).getTime();
		},(deltaTime>this.loop_interval) ? 0 : (this.loop_interval-deltaTime));
	},
	stoped(){
		this.interval_instance && clearInterval(this.interval_instance);
	},
};

