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

	getKneePoint: function(dat,period){
		return new Promise(async (resolve,reject)=>{
			dat = await Segment.diff(dat);
			dat = _.map(dat,Math.sign);
			dat = await Segment.diff(dat);
			let prevId,nextId;
			dat = _.map(dat,(d,index)=>{
				if(Math.abs(d)<2) return 0;
				if(_.isUndefined(nextId)){
					nextId = index;
				}else if(_.isUndefined(prevId)){
					prevId = nextId;
				}else{
					prevId = nextId;
					nextId = index;
				}
				return -Math.sign(d);
			});
			//** 最后一个极值不满足周期长度，取消极值点
			if(period && nextId-prevId<period) dat[nextId] = 0;
			resolve(dat);
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

	isKneePointAvalible: (row)=>{
		let up = 0;
		let down = 0;
		_.each(row,(d)=>{
			if(Number(d)>0.1) up++;
			if(Number(d)<-0.1) down++;
		});
		return Promise.resolve((up<=1 && down<=1) ? true : false);
	},

	isSegmented: (dat,period)=>{
		return new Promise(async (resolve,reject)=>{
			let matrix = await Segment.getMatrix(dat,period);
			let success = true;
			for (let row of matrix){
				let tmp = await Segment.isKneePointAvalible(row);
				if(!tmp) success = false;
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
	transformKneePoint1: function(ticks,indicators){
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
			console.log(`prevId=${indicators[prevId]},ind=${ind}`)
			if(Math.sign(indicators[prevId]) != Math.sign(ind)) return;
			let partial = ticks.slice(prevId,index);
			if(ind>0){
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

	transformKneePoint: (ticks,indicators)=>{
		if(_.isUndefined(ticks) || _.isUndefined(indicators)) return Promise.reject('arguments missed.');
		if(ticks.length != indicators.length) return Promise.reject('ticks length is not same as indicators length.');
		let transformedIndex = [];
		transformedIndex = _.map(ticks,()=>0);
		let prevMaxId;
		_.each(indicators,(ind,index)=>{
			if(Number(ind)>=0) return;
			if(_.isUndefined(prevMaxId)){
				prevMaxId = index;
				return;
			}
			console.log(`prevMaxId=${prevMaxId},index=${index}`)
			let partial = ticks.slice(prevMaxId,index);
			let max = _.max(partial);
			let maxIndex = prevMaxId + _.indexOf(partial,max);
			transformedIndex[maxIndex] = 1;
			prevMaxId = index;
		});
		let prevMinId;
		_.each(indicators,(ind,index)=>{
			if(Number(ind)<=0) return;
			if(_.isUndefined(prevMinId)){
				prevMinId = index;
				return;
			}
			console.log(`prevMinId=${prevMinId},index=${index}`)
			let partial = ticks.slice(prevMinId,index);
			let min = _.min(partial);
			let minIndex = prevMinId + _.indexOf(partial,min);
			transformedIndex[minIndex] = -1;
			prevMinId = index;
		});
		return Promise.resolve(transformedIndex);
	},

	getSegmentIndex: async (ticks,period)=>{
		period = period || 5;
		let result;
		let sample = 1;
		while(true){
			if(sample>100) break;
			let ma = await Segment.smooth(ticks,sample,true);
			let kneePoints = await Segment.getKneePoint(ma,period);
			if(await Segment.isSegmented(kneePoints,period)){
				result = await Segment.transformKneePoint(ticks,kneePoints);
				//** 调试
				// result = kneePoints;
				break;
			}
			// console.log(`sample:${sample}`);
			sample++;
		}
		// console.log(`sample: ${sample}`);
		return result;
	},
};

module.exports = exports = Segment;