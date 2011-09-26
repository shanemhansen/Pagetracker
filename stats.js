var clc = require('cli-color');
var tty = require('tty');
var ResponseStatistics = function() {
    this._data = [];
    
};
ResponseStatistics.prototype.startAt = function(ts) {
    this._ts = ts;
};
ResponseStatistics.prototype.add = function(statistic) {
    this._data = this._data.concat(statistic);
};
ResponseStatistics.prototype.dump = function() {
    var boundaries = this.stats();
    //calculate the color boundaries for red/green/yellow   
    var l = this._data.length;
    
    var ranges = [
	boundaries.min,
	(boundaries.max - boundaries.min)*1.0/3+boundaries.min,
	(boundaries.max - boundaries.min)*2.0/3+boundaries.min,
	boundaries.max
    ];
    var data = this._data;
    var color;
    var weAreInATerminal = tty.isatty(1);
    for(var i=1;i<l;i++) {//purposely start at 1 instead of 0 so that data[i-1] is valid
	var ts = data[i].time - data[i-1].time;//calculate first difference
	if(weAreInATerminal) {
	    if(ts < ranges[1]) {
		color=clc.green;
	    }
	    else if(ts >= ranges[1] && ts < ranges[2]) {
		color=clc.magenta;
	    }
	    else {
		color=clc.red;
	    }
	}
	else {
	    color = function(it) {return it;};
	}
	//remove newlines
	var width = tty.isatty(1)?process.binding('stdio').getWindowSize()[1]:80;
	width=width - 15;//leave some space 1317005705832:

	//get 80 characters
	var buf = data[i].data;

	var lines = buf.toString('utf8').split(/[\r\n]+/);
	for(var j=0;j<lines.length;j++) {
	    var line = lines[j];

	    line = line.replace(/\t/g,'\\t');
//	    line = line.slice(0,width);
	    console.log(data[i].time - this._ts+':'+color(line));
	}
//	var line = buf.toString('utf8').replace(/[\r|\n]+/g,'\\n').replace(/\t/g,'\\t');
	//trim to terminal width
    }
}
ResponseStatistics.prototype.stats = function() {
    var l = this._data.length;
    var data = this._data;
    console.log("Received "+l+" packets");
    var t=0;
    //maximum and minimum wait times.
    var max=0;
    var min=0;
    var previous = data[0].time;//initialize
    for(var i=1;i<l;i++) {
	var ts = data[i].time - data[i-1].time;//calculate first difference
	if(ts>max) {
	    max = ts;
	}
	if(ts<min) {
	    min = ts;
	}
    }
    console.log('max \u0394 between packets: '+max+ ' ms');
    console.log('min \u0394 between packets: '+min+ ' ms');
    console.log('time to first byte: '+(data[0].time - this._ts)+' ms');
    return {
	'max':max,
	'min':min
    };
};
exports.ResponseStatistics = ResponseStatistics;