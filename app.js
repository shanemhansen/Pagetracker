#!/usr/bin/env node
var http = require('http');
var stats = require('./stats');
var collector = new stats.ResponseStatistics();
var url = require('url');
if(!process.argv[2]) {
    console.error('usage: app.js url');
    process.exit(1);
}
url = url.parse(process.argv[2]);
var request = http.request(
    {
	host: url.host,
	port: url.port||80,
	path:url.path,
	method:'GET'
    }
    ,function(res) {
	res.on('end',function() {
	    collector.dump();
	});
	res.on('data',function(d) {
	    collector.add(
		{
		    data:d,
		    time:(new Date()).getTime()
		}
	    )
	});
    });
collector.startAt( (new Date()).getTime() );
request.end();
