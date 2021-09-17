const path = require('path');
const fs = require('fs');

//** 默认使用env.sample配置文件
const config_file = path.join(__dirname,'../..','.env');
if(!fs.existsSync(config_file)){
	let sampleFile = path.join(__dirname,'../..','env.sample');
	if(!fs.existsSync(sampleFile)) throw new Error(`${sampleFile.toString()} does not exist.`);
	fs.writeFileSync(config_file,fs.readFileSync(sampleFile,'utf8'), 'utf8');
}
//** 配置文件常量存入process.env中
require('dotenv').config({path:config_file});

module.exports = exports = {
	dotenv: process.env,
};
