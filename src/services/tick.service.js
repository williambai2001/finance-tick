const moment = require('moment');
const _ = require('underscore');
const request = require('superagent');
const iconv = require('iconv-lite');

module.exports = exports = {
	name: 'Tick',

	actions: {
		//** get last tick
		get: {
			handler(ctx){
				if(!_.isArray(this.ticks) || this.ticks.length==0) return {};
				return this.ticks.slice(-1);
			},
		},
		//** get all cached ticks
		getAll: {
			handler(ctx){
				if(!_.isArray(this.ticks)) return [];
				return this.ticks;
			},
		},
	},
	events: {

	},
	
	methods: {
		//** holidays on every year
		getHolidays(){
			return [
				'2021-01-01',
			];
		},
		//** ignore on daily which is off on trade.
		dailyIgnore(daily){
			let days = this.getHolidays();
			if(_.contains(days,daily)) return true;
			return false;
		},
		//** ignore on time which is off on trade.
		timeIgnore(date){
			if(moment(date,'HH:mm:ss').isBetween(moment('09:30:00','HH:mm:ss'),moment('11:30:00','HH:mm:ss')) || 
				moment(date,'HH:mm:ss').isBetween(moment('13:00:00','HH:mm:ss'),moment('15:00:00','HH:mm:ss'))) return false;
			return true;
		},
		//** request symbols
		initSymbols(codes){
			codes = codes || this.codes || [];
			var symbols = [];
			for (var c = 0; c < codes.length; c++) {
				var range = (codes[c]).split('-');
				if(range.length == 1) range[1] = range[0];
				for (var i = range[0]; i <= range[1]; i++) {
					(function (k) {
					//对股票代码做处理，使其满足新浪财经接口的字段参数格式
					var k_str = k.toString();
					if (k_str.length < 6) {
					var zeros = "";
					for (var m = 0; m < 6 - k_str.length; m++) {
					zeros += "0";
					}
					k_str = zeros + k_str;
					}

					var market = "sh";
					if (k_str.substring(0,1) == "6") {
					market = "sh";
					} else {
					market = "sz";
					}
					symbols.push(market+k_str);
					})(i);
				}
			}
			return symbols;
		},
		initIndicators(codes){
			var indicators = [];

			for (var c = 0; c < codes.length; c++) {
				var range = (codes[c]).split('-');
				if(range.length == 1) range[1] = range[0];
				for (var i = range[0]; i <= range[1]; i++) {
					(function (k) {
					//对股票代码做处理，使其满足新浪财经接口的字段参数格式
					var k_str = k.toString();
					if (k_str.length < 6) {
					var zeros = "";
					for (var m = 0; m < 6 - k_str.length; m++) {
					zeros += "0";
					}
					k_str = zeros + k_str;
					  }

					  var market;
					  if (k_str.substring(0,1) == "3") {
					market = "sz";
					  } else {
					market = "sh";
					  }
					  indicators.push(market+k_str);
					})(i);
				}
			}
			return indicators;
		},
		//** request ticks
		async requestTick(symbols){
			symbols = symbols || this.symbols || [];
			let symbolsTick = {};
			let perGroup = 300;
			let count = 0;
			let groups = [];
			while(true){
				if(count>=symbols.length) break;
				groups.push(symbols.slice(count,count+perGroup));
				count += perGroup;
			}
			let groupsPromises = [];
			for (const group of groups){
				let groupPromise = 
					request
						.get('http://hq.sinajs.cn')
						.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36')
						.query(`list=${group.join(',')}`)
						.then(res=>{
							// console.log(res);
							let body = res.body;
							try{
								body = iconv.decode(body,'gb2312');
							}catch(e){
								console.error(e);
							}
							if(!/var hq_str_/.test(body)) throw new Error({code: 40040,msg: 'body 数据格式不对。'});
							// console.log(body);
							var lines = body.split(';');
							var parts,symbol,quoteData,quoteObject;
							_.each(lines, function(line){
								parts = line.split('=');
								if(parts.length<2) return;
								symbol = String.prototype.replace.call(parts[0],'var hq_str_','');
								symbol = String.prototype.replace.call(symbol,'\n','');
								if(symbol.length<6) return;
								quoteData = parts[1].replace('"', '').split(',');
								if (quoteData.length < 33) return;
								
								quoteObject = {
									symbol: symbol,
									name: quoteData[0], //股票名称
									open: quoteData[1], //今日开盘价
									closed: quoteData[2], //昨日收盘价
									price: quoteData[3], //当前价格
									highest: quoteData[4], //今日最高价
									lowest: quoteData[5], //今日最低价
									buy: quoteData[6], //竞买价，即“买一”报价
									sell: quoteData[7], //竞卖价，即“卖一”报价
									quantity: quoteData[8], //成交的股票数，由于股票交易以一百股为基本单位，所以在使用时，通常把该值除以一百
									money: quoteData[9], //成交金额，单位为“元”，为了一目了然，通常以“万元”为成交金额的单位，所以通常把该值除以一万
									buy_v1: quoteData[10], //“买一申请4695股，即47手
									buy_p1: quoteData[11], //“买一报价
									buy_v2: quoteData[12], //买二
									buy_p2: quoteData[13], //买二
									buy_v3: quoteData[14], //“买三
									buy_p3: quoteData[15], //“买三
									buy_v4: quoteData[16], //“买四
									buy_p4: quoteData[17], //“买四
									buy_v5: quoteData[18], //“买五
									buy_p5: quoteData[19], //“买五
									sell_v1: quoteData[20], //“卖一申报3100股，即31手
									sell_p1: quoteData[21], //卖一报价
									sell_v2: quoteData[22], //卖二
									sell_p2: quoteData[23], //卖二
									sell_v3: quoteData[24], //卖三
									sell_p3: quoteData[25], //卖三
									sell_v4: quoteData[26], //卖四
									sell_p4: quoteData[27], //卖四
									sell_v5: quoteData[28], //卖五
									sell_p5: quoteData[29], //卖五
									date: quoteData[30], //日期
									time: quoteData[31], //时间					
								};
								symbolsTick[symbol] = quoteObject;
							});
						})
						.catch(err=>{
							console.log(err.status);
						});
				groupsPromises.push(groupPromise);
			}
			await Promise.all(groupsPromises);
			// console.log(symbolsTick);
			return symbolsTick;
		},
	},
	//** lifecycle
	created(){
		this.loop_time = (new Date).getTime();
		this.loop_interval = 30000;
		this.interval_instance = null;
		this.codes = ['000001~000999','300000~301000'];
		this.symbols = ['sh000001'];
		this.blacklist = [];
		this.SYMBOLS_TICK_MAX = 5;
		this.ticks = [];
	},
	started(){

		//** periodic fetch tick
		let deltaTime = (((new Date).getTime() - this.loop_time)/1000).toFixed(0);
		this.interval_instance = setInterval(async ()=>{
			let today = moment().format('YYYY-MM-DD');
			if(this.dailyIgnore(today)){
				console.warn(`WARNING: ${today} is holiday.`);
				return;
			}
			let time = moment().format('HH:mm:ss');
			if(this.timeIgnore(time)){
				console.warn(`WARNING: ${time} is not trade time.`);
				return;
			}
			if(this.ticks.length>this.SYMBOLS_TICK_MAX) this.ticks.shift();
			symbolsTick = await this.requestTick(this.symbols);
			this.ticks.push(symbolsTick);
			this.loop_time = (new Date).getTime();
			// console.log(this.ticks);
			// console.log(this.ticks.length);
		},(deltaTime>this.loop_interval) ? 0 : (this.loop_interval-deltaTime));
	},
	stoped(){
		this.interval_instance && clearInterval(this.interval_instance);
	},
};