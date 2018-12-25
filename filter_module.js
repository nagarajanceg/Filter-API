'use strict'
var get = require('get-value');
var schema = require('./filter_schema');
var mm =  require('micromatch');
var filter_module = (function(){
	var verifyNameandType = function(name, keyType, opt){
		if( opt===true && name===undefined ){
			return true;
		}
		if( name!==undefined && typeof(name)===keyType ){
			return true;
		}
		return false
	}
	var validate = function(data, input_attrib){
		for(var key in input_attrib){
			// console.log("key ===> ",key, typeof(input_attrib[key]), schema[key].type);
			var attribute = input_attrib[key];
			// console.log("schema[key] ==> ", schema[key]);
			if(schema[key] === undefined){
				console.log("invalid format. Make sure with schema attributes");
				 return false;
			}else{
				if(typeof(attribute) === schema[key].type){
					var requiredKeys = schema[key].required;
					var optionalKeys = schema[key].optional;
					for(var k in requiredKeys ){
						if(verifyNameandType( attribute[requiredKeys[k].name], requiredKeys[k].type )){
						// if(attribute[requiredKeys[k].name] !== undefined && typeof(attribute[requiredKeys[k].name]) === requiredKeys[k].type){
							console.log("valid by inner timing");
						}else{
							return false;
						}
					}
					for(var k in optionalKeys){
						if(!verifyNameandType( attribute[optionalKeys[k].name], optionalKeys[k].type ,true )){
							console.log("optional type field failed");
							return false;
						}
					}
					// console.log("valid");	
				}else{
					console.log("attribute type mismatched");
					return false;
				}
				
			}
		}
		// console.log(data, schema);
		return true;
	}
	var findCategory = function(attribute){
		if(attribute.min !== undefined && attribute.max !== undefined){
			// console.log("min ==> cat 3");
			return 3;
		}else if(attribute.min != undefined){
			return 1;
		}else if(attribute.max != undefined){
			return 2;
		}else{
			return 4;
		}
	}
	var filterByNumber = function(data, category, attr_in_data, filter_attr){
		var results;
		switch(category){
			case 1:
				results = data.filter(function(element){
					if(element[attr_in_data] >= filter_attr.min){
						return element;
					}
				});
				break;
			case 2:
				results = data.filter(function(element){
					if(element[attr_in_data] <= filter_attr.max){
						return element;
					}
				});
				// console.log("case 2");
				break;
			case 3:
				results = data.filter(function(element){
					if(element[attr_in_data] >= filter_attr.min && element[attr_in_data] <= filter_attr.max){
						return element;
					}
				});
				// console.log("case 3");
				break;
			default:
				results = data.filter(function(element){
					if(element[attr_in_data] >= 0){
						return element;
					}
				});
				break;
		}
		return results;
	}
	var conditionMatch = function(attribute1, attribute2, condition){
		//condition == true means greater 
		if(condition){
			return attribute1 >= attribute2;
		}else{
			return attribute1 <= attribute2
		}
	}
	
	var exactFilter = function(data, attr_in_data, input_attrib){
		return data.filter(function(element){
			// console.log("mm match =>", mm.isMatch(element[attr_in_data],input_attrib));
			if(element[attr_in_data] === input_attrib){
				return element;
			}
		});
	}
	var globFilter = function(data, attr_in_data, input_attrib){
		// console.log(attr_in_data, input_attrib);
		return data.filter(function(element){
			if(mm.isMatch(element[attr_in_data], input_attrib)){
				return element;
			}
		});
	}
	var regexFilter = function(data, attr_in_data, input_attrib){
		// console.log("inside regex match ==", input_attrib);
		var rg = new RegExp(/^(fi*)/gmi);
		// console.log("regx =>",rg);
		return data.filter(function(element){
			if(element[attr_in_data].match(rg) != null){
				return element;
			}
		});
	}
	
	var lexicographicFilter = function(condition){
		return function(data, attr_in_data, input_attrib){
			return data.filter(function(element){
				if(conditionMatch(element[attr_in_data], input_attrib, condition)){
					// console.log("element ==>", element);
					return element;
				}
			});
		}
	}
	var booleanFilter = function(data,attr_in_data, input_attrib){
		return data.filter(function(element){
			if(element[attr_in_data] === input_attrib){
				return element;
			}
		});
	}
	var findTypeofFilter = function(prefix){
		switch(prefix){
			case "gl":
				// console.log("return glob filter");
				return globFilter
				break;
			case "lt":
				// console.log("lt filter");
				return lexicographicFilter(false);
				break;
			case "gt":
				// console.log("gt filter");
				return lexicographicFilter(true);
				break;
			case "re":
				return regexFilter;
				break;
			default:
				return exactFilter;
				break;
		}
	}
	//core method to figure basic data type required to filter 
	var fetchResults = function(data, input_attrib){
		var result = null;
		if(validate(data, input_attrib)){
			for(var key in input_attrib){
				// console.log("curr =>",key);
				if(result !== null){
					data = result;
				}
				if(typeof(input_attrib[key]) === "string"){
					var name = input_attrib[key].split(":");
					// console.log(name);
					var filterType = findTypeofFilter(name.splice(0,1).join(""));
					if(filterType){
						result = filterType(data, key, name.join(":"));
						// console.log("result filter ==> ",result);
					}else{
						console.log("Please make sure filter prefix");
					}
				}else if(typeof(input_attrib[key]) === "object"){
					// console.log("other attributes check");
					var category = findCategory(input_attrib[key]);
					result = filterByNumber(data, category, key, input_attrib[key]);
				}else if(typeof(input_attrib[key]) === "boolean"){
					result = booleanFilter(data, key, input_attrib[key]);
				}
			}
			// console.log("validate = ", true, result);
		}else{
			console.log("validate = ", false);
		}
		return result;
	}
	return {
		fetch : fetchResults
	}
})();

module.exports = filter_module;