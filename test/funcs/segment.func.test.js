const _ = require('underscore');
const SegmentFunc = require('../../src/funcs/segment.func');

describe('segment.func',()=>{
	it('.smooth()',async ()=>{
		let data = require('../fixtures/126.net.daily.close.json');
		let partial = -50;
		let dat = data.closes.slice(partial);
		let ma = await SegmentFunc.smooth(dat,5,true);
		console.log(ma);
		expect(ma.length).toBe(dat.length);
	});
	it('.diff()', async ()=>{
		let dat = [10.2,12.4,12.5,12.6,11.3,10.6,11.3];
		let diff = await SegmentFunc.diff(dat).catch(console.error);
		console.log(diff);
	});
	it('.getKneePoint()',async ()=>{
		let data = require('../fixtures/126.net.daily.close.json');
		let partial = -50;
		let dat = data.closes.slice(partial);
		let diff = await SegmentFunc.getKneePoint(dat).catch(console.error);
		console.log(diff);

	});
	it('.isKneePointAvalible()',async ()=>{
		var dat = [
				[0,0,0,1,0,0,0],
			];
		for(var d of dat){
			var kneePoint = await SegmentFunc.isKneePointAvalible(d).catch(console.error);
			expect(kneePoint).toBe(true);
		}
		var dat = [
				[0,1,0,-1,0,1,0],
			];
		for(var d of dat){
			var kneePoint = await SegmentFunc.isKneePointAvalible(d).catch(console.error);
			expect(kneePoint).toBe(false);
		};
	});
	it('.getMatrix()',async ()=>{
		let dat = [0,0,0,0,1,0,-1];
		let matrix = await SegmentFunc.getMatrix(dat,5).catch(console.error);
		console.log(matrix);

	});
	it('.isSegmented()',async ()=>{
		var dat = [0,0,0,1,0,0,0,0,0];
		var success = await SegmentFunc.isSegmented(dat,5).catch(console.error);
		expect(success).toBe(true);
		var dat = [0,0,0,1,0,-1,0,1,0];
		var success = await SegmentFunc.isSegmented(dat,5).catch(console.error);
		expect(success).toBe(false);
		// console.log(success);
	});
	it('.transformKneePoint()',async ()=>{
		var ticks = [12,13,14,15,13,14,12,11,10,10,12];
		var indicators = [0,0,0,0,1,0,0,0,-1,0,1];
		var transformedIndex = await SegmentFunc.transformKneePoint(ticks,indicators).catch(console.error);
		console.log(transformedIndex); 
	});
	it('.getSegmentIndex()',async ()=>{
		let data = require('../fixtures/126.net.daily.close.json');
		let partial = -100;
		let name = data.name;
		let symbol = data.symbol;
		let times = data.times.slice(partial);
		let closes = data.closes.slice(partial);
		console.log(`symbol:${symbol},times.length:${times.length}`);
		var period = 5;
		var segmentIndex = await SegmentFunc.getSegmentIndex(closes,period);
		// console.log(segmentIndex);
		// return;
		var KneePointTimeIndex = _.map(segmentIndex,(s,i)=>{
			if(Math.abs(s)>0) return s*times[i];
			return 0;
		});
		KneePointTimeIndex = _.filter(KneePointTimeIndex,(s)=>{
			if(s!=0) return s;
		});
		console.log(KneePointTimeIndex);
	});
});