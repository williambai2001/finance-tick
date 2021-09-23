const _ = require('underscore');
const ta = require('ta.js');

const Segment = {
	//** smooth the data 
	smooth: function(ticks,period,padding){
		return new Promise(async (resolve,reject)=>{
			if(period<1 || period>ticks.length) reject(`period can not be ${period}`);
			let ma = await ta.sma(ticks,period).catch(console.error);
			if(padding) ma = _.map(_.range(period-1),()=>0).concat(ma);
			resolve(ma);
		});
	},

	diff: function(dat){
		return new Promise((resolve,reject)=>{
			let tmp = _.map(dat,(d,i)=>{
				if(i==0) return 0;
				return Number(Number(dat[i])-Number(dat[i-1]));
			});
			resolve(tmp);
		});
	},

	getKneePoint: function(dat){
		return new Promise((resolve,reject)=>{
			let tmp = _.map(dat,(d)=>{
				return Math.sign(d);
			});
			resolve(tmp);
		});
	},

	getMatrix: function(dat,col){
		let matrix = [];
		for(let i=0;i<dat.length-col+1;i++){
			let row=[];
			for (let j=0;j<col;j++){
				row[j] = dat[i+j];
			}
			matrix[i] = row;
		}
		return Promise.resolve(matrix);
	},

	isKneePointAvalible: function(row){
		let up = 0;
		let down = 0;
		let tmp = _.map(row,(d,i)=>{
			if(i==0) return 0;
			let diff = Number(row[i])-Number(row[i-1]);
			if(Math.abs(diff)==1) return 0;
			return Math.sign(diff);
		});
		// console.log(`tmp=`,tmp)
		_.each(tmp,(d)=>{
			if(d>0) up++;
			if(d<0) down++;
		});
		// console.log(`up=${up},down=${down}`)
		return Promise.resolve((up<=1 && down<=1) ? true : false);
	},

	isSegmented: (dat,period)=>{
		return new Promise(async (resolve,reject)=>{
			let matrix = await Segment.getMatrix(dat,period);
			let success = true;
			for await (let row of matrix){
				if(!await Segment.isKneePointAvalible(row)) success = false;
			}
			resolve(success);
		});
	},

	/**
	 * 由indicator指标表示的拐点序列，转换为ticks表示的拐点序列
	 * @param  {[type]} ticks      [description]
	 * @param  {[type]} indicators [description]
	 * @return {[type]}            [description]
	 */
	transformKneePoint: function(ticks,indicators){
		if(_.isUndefined(ticks) || _.isUndefined(indicators)) return Promise.reject('arguments missed.');
		if(ticks.length != indicators.length) return Promise.reject('ticks length is not same as indicators length.');
		let transformedIndex = [];
		transformedIndex = _.map(ticks,()=>0);
		let prevId;
		_.each(indicators,(ind,index)=>{
			if(ind==0) return;
			if(_.isUndefined(prevId)){
				prevId = index;
				return;
			}
			if(Math.sign(indicators[prevId]) != Math.sign(ind)) return;
			let partial = ticks.slice(prevId,index);
			if(ind<0){
				let max = _.max(partial);
				let maxIndex = prevId + _.indexOf(partial,max);
				transformedIndex[maxIndex] = 1;
			}else{
				let min = _.min(partial);
				let minIndex = prevId + _.indexOf(partial,min);
				transformedIndex[minIndex] = -1;
			}
			prevId = index;
		});
		return Promise.resolve(transformedIndex);
	},

	getSegmentIndex: function(ticks){
		return new Promise(async (resolve,reject)=>{
			let sample = 1;
			while(true){
				let ma = await smooth(ticks,sample,true).catch(console.error);

			}
		});
	},
};

module.exports = exports = Segment;