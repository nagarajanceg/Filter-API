// var pagination = require('./pagination');
// var stub_data = require('./stub_data');
var sort_routine = require('./sort_module');
var filter = require('./filter_module');
var util = require('util');
// var actual_data = require('./actual_data');
var filter_stub_data = require('./filter_stub_data');
// var sort_stub = require('./sort_stub');
var test = require('tape');

// console.log(pagination.do(stub_data,1,2));
// var actual_options = {
// 	'attribute':['uuid', 'serial_no']
// }

test('Filter API Test', function(t){
	t.plan(3);
	var filter_input = {
		name:"gl:*th",
		capacity: {
			min:20,
			max:69
		}
	}
	var result1 = filter.fetch(filter_stub_data, filter_input );
	t.equal(1, result1.length);

	filter_input = {
		capacity: {
			min:20,
			max:70
		}
	}
	var result2 = filter.fetch(filter_stub_data, filter_input);
	t.equal(3, result2.length);
	var filter_options = 
		[
			{
				'attribute' : 'id',
				// 'order': 'desc'
			},
			// {
			// 	'attribute' : 'name',
			// 	// 'order': 'desc'
			// },
			{
				'attribute' : 'capacity',
				// 'order': 'desc'
			}
		]
	
	
	sort_routine.sort(result2,filter_options);
	console.log("sorting",result2);
	var final_pos = result2.map(function(a){
		return a.id;
	});
	final_pos = final_pos.join('')
	var str = "613";
	t.equal(str, final_pos);

	filter_input = {
		name:"re:/^(fi*)/gm"
	}
	var result3 = filter.fetch(filter_stub_data, filter_input);
	console.log("************** result 3 ************** \n ",result3);

	filter_input = {
		name:"gt:hannah"
	}
	var result4 = filter.fetch(filter_stub_data, filter_input);
	console.log("************** result 4 ************** \n ", result4);

	filter_input = {
		name:"lt:hannah"
	}
	var result5 = filter.fetch(filter_stub_data, filter_input);
	console.log("************** result 5 ************** \n", result5);

	filter_input ={
		online:true
	}
	var result6 = filter.fetch(filter_stub_data, filter_input);
	console.log("************** result 6 ************** \n",result6);
})
// console.log(util.inspect(actual_data, {showHidden: false, depth: 1}))
// console.log(pagination.max_per_page(stub_data,2));


