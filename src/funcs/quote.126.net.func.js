var _ = require('underscore');
var request = require('superagent');
var iconv = require('iconv-lite');


module.exports = {
	/**
	 * 获取不复权历史收盘价
	 * @param  {[type]}   symbol [description]
	 * @return {[type]}          [description]
	 */
	// getDailyClose: (symbol)=>{
	// 	if(!/^[sh|sz]/.test(symbol)) return Promise.reject('arguments is wrong');
	// 	return new Promise((resolve,reject)=>{
	// 		var url = 'http://img1.money.126.net/data/hs/kline/day/times/{1399001}.json';
	// 		symbol = symbol.replace(/^sh/,'0');
	// 		symbol = symbol.replace(/^sz/,'1');
	// 		url = url.replace('{1399001}',symbol);
	// 		request
	// 			.get(url)
	// 			.set('User-Agent','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36')
	// 			.query()
	// 			.then((res)=>{
	// 				try{
	// 					let text;
	// 					text = JSON.parse(res.text);
	// 					resolve(text);
	// 				}catch(e){
	// 					reject(e)
	// 				};
	// 			})
	// 			.catch(reject);
	// 	});
	// },

	getDailyClose: async (symbol)=>{
		if(!/^[sh|sz]/.test(symbol)) return Promise.reject('arguments is wrong');
		var url = 'http://img1.money.126.net/data/hs/kline/day/times/{1399001}.json';
		symbol = symbol.replace(/^sh/,'0');
		symbol = symbol.replace(/^sz/,'1');
		url = url.replace('{1399001}',symbol);
		let res = await request
				.get(url)
				.set('User-Agent','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36')
				.query();
		if(!res || !res.text) return Promise.reject(`response's text is missed.`);
		try{
			let text;
			text = JSON.parse(res.text);
			return Promise.resolve(text);
		}catch(e){
			return Promise.reject(e);
		};
	},

	// getDailyClose: (symbol)=>{
	// 	if(!/^[sh|sz]/.test(symbol)) return Promise.reject('arguments is wrong');
	// 	var url = 'http://img1.money.126.net/data/hs/kline/day/times/{1399001}.json';
	// 	symbol = symbol.replace(/^sh/,'0');
	// 	symbol = symbol.replace(/^sz/,'1');
	// 	url = url.replace('{1399001}',symbol);
	// 	return request
	// 			.get(url)
	// 			.set('User-Agent','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36')
	// 			.query()
	// 			.then((res)=>{
	// 				try{
	// 					console.log('++++++')
	// 					let text;
	// 					text = JSON.parse(res.text);
	// 					return Promise.resolve(text);
	// 				}catch(e){
	// 					return Promise.reject(e);
	// 				};
	// 			})
	// 			// .catch(err=>console.error(err.status));
	// },

};