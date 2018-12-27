var YzxPromotionDetail = function() {
	'use strict';
	
	var vm = undefined;
	/**
	 * 初始化Vue
	 */
	function initVue() {
		var u = navigator.userAgent, app = navigator.appVersion;
	  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
	  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

		var promotionData = {
			token_yzx: ''
		}
		
		vm = new Vue({
			el : '#promotion-page',
			data : promotionData,
			methods : {
				checkLogin: function() {
					if(window.gyObject){
						if(window.gyObject.isLogin()){
							//已经登录，可以获取用户登录token
							var token = window.gyObject.getLoginToken();
							return true;
						}
					}
					return false;
				},
				backPromotionList: function(){
					var self = this;
					if (isIOS) {
						
						var obj = new Object();
						obj.message="Appear"
						window.webkit.messageHandlers.infoMainViewNotify.postMessage(JSON.stringify(obj));
						
					}
					if (isAndroid) {
					}
				}
			},
			created: function () {
				var self = this;
				self.token_yzx = Utils.generateParameterMapByUrl(document.URL)['token_yzx'];
			}
		});

		return vm;
	}

	return {
		init : function() {
			vm = initVue();
			
			$.init();
		}
	}

}();