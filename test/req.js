const request = require('superagent');

module.exports = {
	get: (url)=>{
		return new Promise((resolve,reject)=>{
		request
			.get(url)
			.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36')
			.query()
			.then(res=>{
				resolve(res);
			});
		});
	},
};