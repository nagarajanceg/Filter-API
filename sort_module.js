'use strict'
var arraySort = require('array-sort');

var sortingModule = (function(){
	var sortHandler = function(data, parameter){
		switch(parameter.length){
			case 1: 
				// console.log("one parama",parameter[0]);
				arraySort(data, parameter[0])
				break;
			case 2:
				// console.log("two parameter",parameter[0],parameter[1]);
				arraySort(data, parameter[0], parameter[1]);
			default:
				break;
		}
	}
	var sortRoutine = function(data, opts){
		if(data.length == 0){
			return;
		}
		opts.forEach(function(value){
			var parameter = [];
			if(value.attribute != null){
				parameter.push(value.attribute);
			}
			if(value.order === 'desc'){
				parameter.push({reverse:true});
			}
			sortHandler(data, parameter);
			// console.log("sorted result ==", data);
		})
		
		// if(opts.custom_func != null){
		// 	console.log("custom_func");
		// }
		// console.log("sort module parameter", parameter.length);
		// console.log("Not reverse",arraySort(data, [],{reverse: true}));
		
	}
	return{
		sort: sortRoutine
	}
})();

module.exports = sortingModule;

