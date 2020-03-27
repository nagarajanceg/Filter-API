'use strict'
var constant = require('./constants');
 
var pagination =(function() {

	var default_limit = constant.DEFAULT_PAGE_LIMIT;
	var max_limit = constant.MAXIMUM_PAGE_LIMIT;

	function doPaginate(data, start=0, end=default_limit){
		console.log(data.length,"page data");
		console.log("start=",start, "default_limit=",end);
		if(end > max_limit){
			end = max_limit;
		}
		return data.slice(start, start+end);
	}
	function doPaginateMax(data,start=0){
		return data.slice(start, start+max_limit);
	}
	return{
		do:doPaginate,
		max_per_page: doPaginateMax
	}

})();

module.exports = pagination;