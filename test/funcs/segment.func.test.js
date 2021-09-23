const _ = require('underscore');
const SegmentFunc = require('../../src/funcs/segment.func');

describe('segment.func',()=>{
	it('.smooth()',async ()=>{
		let ticks = [1,2,3,4,5,10];
		let ma = await SegmentFunc.smooth(ticks,5,true).catch(console.error);
		console.log(ma);
		expect(ma.length).toBe(ticks.length);
	});
	it('.diff()', async ()=>{
		let dat = [10,12,11,14,15];
		let diff = await SegmentFunc.diff(dat).catch(console.error);
		console.log(diff);
	});
	it('.getKneePoint()',async ()=>{
		let dat = [-0.1,0.12,0.11,0.14,-0.15];
		let diff = await SegmentFunc.getKneePoint(dat).catch(console.error);
		console.log(diff);

	});
	it('.getMatrix()',async ()=>{
		let dat = [-1,1,1,1,-1,1,1,1,1];
		let matrix = await SegmentFunc.getMatrix(dat,5).catch(console.error);
		console.log(matrix);

	});
	it('.isKneePointAvalible()',async ()=>{
		var dat = [
				[0,0,0,0,0],
				[0,0,0,0,1],
				[0,0,0,1,1],
				[0,0,1,1,1],
				[0,1,1,1,1],
				[1,1,1,1,1],
				[1,1,1,1,-1],
				[1,1,1,-1,-1],
				[1,1,-1,-1,-1],
				[1,-1,-1,-1,-1],
				[-1,-1,-1,-1,-1],
				[-1,-1,-1,-1,1],
				[-1,-1,-1,1,1],
				[-1,-1,1,1,1],
				[-1,1,1,1,1],
				[-1,0,0,0,0],
				[-1,-1,0,0,0],
				[-1,-1,-1,0,0],
				[-1,-1,-1,-1,0],
				[-1,1,1,1,-1],
				[1,-1,-1,-1,1],
				[1,-1,-1,-1,-1,1],
				[-1,1,1,1,1,-1],
			];
		for(var d of dat){
			var kneePoint = await SegmentFunc.isKneePointAvalible(d).catch(console.error);
			expect(kneePoint).toBe(true);
		}
		var dat = [
				[1,-1,1,-1,1],
				[-1,1,-1,1,-1],
				[1,-1,-1,1,-1,1],
				[1,-1,1,-1,-1,1],
				[-1,1,1,-1,1,-1],
			];
		for(var d of dat){
			var kneePoint = await SegmentFunc.isKneePointAvalible(d).catch(console.error);
			expect(kneePoint).toBe(false);
		};
	});
	it('.isSegmented()',async ()=>{
		var dat = [-1,1,1,1,-1,1,1,1,1];
		var success = await SegmentFunc.isSegmented(dat,5).catch(console.error);
		expect(success).toBe(true);
		var dat = [-1,1,1,1,-1,1,1,1,1,-1,-1,1,-1];
		var success = await SegmentFunc.isSegmented(dat,5).catch(console.error);
		expect(success).toBe(false);
		console.log(success);
	});
	it('.transformKneePoint()',async ()=>{
		var ticks = [12,13,14,15,13,14,12,11,10,10,12];
		var indicators = [0,0,0,0,1,0,0,0,-1,0,1];
		var transformedIndex = await SegmentFunc.transformKneePoint(ticks,indicators).catch(console.error);
		console.log(transformedIndex); 
	});
	it('.getSegmentIndex()',()=>{

	});
});