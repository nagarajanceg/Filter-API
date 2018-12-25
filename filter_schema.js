'use strict'
//filter attributes types
module.exports={
	id:{
		type: 'number'
	},
	name:{
		type: 'string'
	},
	capacity:{
		type:'object',
		required:[
			
		],
		optional: [
			{
				name:"max",
				type: 'number'
			},
			{
				name: "min",
				type: 'number'
			}
		]
	},
	online: {
		type:'boolean'
	}
}