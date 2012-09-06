define ([], 
function(){
	var ConfigModel = Backbone.Model.extend({
		defaults : {
			location : "Bloor",
			tables : 
			['Table 1'],
			appetizers : [
				{
					name : "Gyoja", price : "8.99", 
					tax : [{type : "HST", rate : "0.05"}, {type : "GST", rate : "0.08"}]
				}, 
				{
					name : "Taco", price : "8.00", 
					tax : [{type : "HST", rate : "0.13"}]
				}
				],
			extra : [
				{
					name : "noodle", price : "0.99", 
					tax : [{type : "HST", rate : "0.13"}]
				}, 
				{
					name : "meat", price : "3.99", 
					tax : [{type : "HST", rate : "0.13"}]
				}
			],
			drinks : [
				{
					name : "soda", price : "1.99", 
					tax : [{type : "HST", rate : "0.13"}]
				},
				{
					name : "soju", price : "6.99", 
					tax : [{type : "HST", rate : "0.15"}]
				}
			],
			main : [
				{
					name : "shio", price : "6.99", src : "img/150x150.gif",
					tax : [{type : "HST", rate : "0.15"}]
				},
				{
					name : "king", price : "6.99", src : "img/150x150.gif",
					tax : [{type : "HST", rate : "0.15"}]
				}

			]
		},
		initialize : function(){
		//	this.fetch();
		},

		fetch : function(e, fn){
			var self = this;
			//Get config from db
			$.post("/get_setting", function(data){
				if (data.settings.length < 10){
					console.log(data.settings);
					return;
				}
				var config = JSON.parse(data.settings);
				self.set('tables', config.tables);
				self.set('appetizers', config.appetizers);
				self.set('extra', config.extra);
				self.set('drinks', config.drinks);
				self.set('main', config.main);
				self.set('location', config.location);
				self.set('notes', data.notes);
				fn(self);
				$('#notes').html(data.notes);
			});
		},

		save : function(fn){
			$.post("/save_setting", {data : JSON.stringify(this.toJSON())}, function(ret){
				if(ret == 'ok'){
					//window.location.href = "/";
					fn('ok');
				} else {
					alert("ERROR");
					fn('err');
				}
			});
		}
	});

	return ConfigModel;
});