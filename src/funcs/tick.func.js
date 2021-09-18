const moment = require('moment');
const _ = require('underscore');

module.exports = exports = {
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
	};