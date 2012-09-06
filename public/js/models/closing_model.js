define ([
],
function(){
	var ClosingModel = Backbone.Model.extend({
		defaults : {
			name : '',
			pos_cash : 0.0,
			pos_card : 0.0,
			pos_tip : 0.0,
			pos_coupon : 0.0,
			pos_discount : 0.0,
			pos_total : 0.0,
			drawer_cash : 0.0,
			drawer_card : 0.0,
			drawer_total : 0.0,
			drawer_tip : 0.0,
			drawer_expense : 0.0,
			section : 'Noon',
			difference : 0.0,
			cash_settlement : 0.0
		},
		initialize : function () {
		},

		fetch : function(fn){
			var self = this;
			$.post('/getTodaysSale', function(ret){
	          if (ret == 'err'){
	            alert("there was an error. Please restart.");
	            return;
	          }
	          self.pos_summary = ret;
	          self.set('pos_cash', parseFloat(ret.cash));
	          self.set('pos_card', parseFloat(ret.card));
	          self.set('pos_coupon', parseFloat(ret.coupon));
	          self.set('pos_discount',parseFloat(ret.discount));
	          self.set('pos_tip', parseFloat(ret.tip));
	          var t = (parseFloat(ret.cash) + parseFloat(ret.card)).toFixed(2);
	          self.set('pos_total', parseFloat(t));
	          self.set('reset_count', parseInt(ret.reset_count));
	          // self.model.set('drawer_cash',);
	          // self.model.set('drawer_card',);
	          // self.model.set('drawer_total',);
	          // self.model.set('drawer_tip',);
	          // self.model.set('drawer_expense',);
	          fn();
	        });
		},

		print : function(){
			$.post('/print_closing_data', function(ret){
				console.log(ret);
			});
		},

		save_closing : function(){
			var self = this;
			self.set('closing_id', getGUID());
			$.post('/save_closing_data', {data : self.toJSON()},function(ret){
				console.log(ret);
			});
		},

		getResetDetail : function(fn){
			$.post('/get_reset_detail', function(ret){
				if (ret == 'err'){
					alert('err');
					return;
				}
				fn(ret);
			});
		},

		getCouponDetails : function(fn){
			$.post('/get_coupon_details', function(ret){
				if (ret == 'err'){
					alert('err');
					return;
				}
				fn(ret);
			});
		},

		get_discount_details : function(fn){
			$.post('/get_discount_details', function(ret){
				if (ret == 'err'){
					alert('err');
					return;
				}
				fn(ret);
			});
		}
	});
	return ClosingModel;
});