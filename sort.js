'use strict'

var sorting = (function(){
	function sortById(data){
		data.sort(function(a,b){
			return a.id - b.id;
		})
	}
	function sortByName(data){
		data.sort(function(a,b){
			var nameA = a.name.toUpperCase(); // ignore upper and lowercase
		  	var nameB = b.name.toUpperCase(); // ignore upper and lowercase
		  	if (nameA < nameB) {
		    	return -1;
		  	}
		  	if (nameA > nameB) {
		    	return 1;
		  	}

		  	// names must be equal
		  	return 0;
		})
	}
	// function default
	var sortByAttrList = function(data, attributeList){
		attributeList.forEach(function(attribute){
			switch(attribute){
				case "id":
						sortById(data);
						break;
				case "name":
						sortByName(data);
						break;
				default: 
					break;
			}	
		});
		return data;
	}

	return {
		byAttribute : sortByAttrList 
	}
})()

module.exports=sorting;