var Signup = function() {
	'use strict';
	
	var vm = undefined;
	/**
	 * 初始化Vue
	 */
	function initVue() {
		var u = navigator.userAgent, app = navigator.appVersion;
	  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
	  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	  

		var signupData = {
			token_yzx: '',				//新长征
			token: '',						//云之享登录令牌
			userId: 0,						//云之享用户ID
			isAgree: false,			//是否赞同
			activityId: '',
			userInfo : {         	//注册信息
				realName: '',
				sex: 1,
				mobile: '',
				idcard: '',
				city: {}
			},
			cityList: [],
			sexList: [{
				value: 1, label: '男', icon: '', active: false
			}, {
				value: 2, label: '女', icon: '', active: true
			}]
		}
		
		vm = new Vue({
			el : '#signup-page',
			data : signupData,
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
				backPromotionDetail: function(){
				},
				goto: function(index) {
					var self = this;
					var url = '';
					if (self.token_yzx) {
//						window.location.href=self.tabList[index].url + "?token_yzx=" + self.token_yzx;
						url = self.tabList[index].url + "?token_yzx=" + self.token_yzx;
					} else {
//						window.location.href=self.tabList[index].url	;
						url = self.tabList[index].url;
					}
					if (isAndroid) {
						window.location.href = url;
					}
					if (isIOS) {
						window.location.replace(url);
					}
				},
				agree: function() {
					var self = this;
					self.isAgree = true;
				},
				pass: function() { // 同意
					var self = this;
					self.isAgree = true;
					$.router.back();
				},
				reject: function() {// 拒绝
					var self = this;
					self.isAgree = false;
					$.router.back();
				},
				setSex: function(index){
					var self = this;
					self.userInfo.sex = self.sexList[index];
				},
				setCity: function(index){
					var self = this;
					self.userInfo.city = self.cityList[index];
				},
				doSignup: function() {
					var self = this;
					if (!self.isAgree) {
						$.toast("请阅读免责声明");
						return false;
					}
					if (self.userInfo.realName == '') {
						$.toast("请填写报名用户的真实姓名");
						return false;
					}
					if (self.userInfo.sex == null || !self.userInfo.sex) {
						$.toast("请选择性别");
						return false;
					}
					if (self.userInfo.mobile == '') {
						$.toast("请填写报名用户手机号码");
						return false;
					}
					if (self.userInfo.idcard == '') {
						$.toast("请填写报名用户身份证号");
						return false;
					}
					if (self.userInfo.city == null || !self.userInfo.city.cityId) {
						$.toast("请选择城市");
						return false;
					}
					
					var data = {
						auth: self.userId,
						token: self.token,
						info: {
							"activityId": self.activityId,
							"realName": self.userInfo.realName, 
							"sex" : self.userInfo.sex, 
							"phoneNumber": self.userInfo.mobile,
							"IDCardNumber": self.userInfo.idcard,
							"cityId": self.userInfo.city.cityId
						}
					};
					var success = function(result){
						if (result && result.errCode == 0) {
							$.toast("报名成功!");
						} else {
							$.toast(result.msg);
						}
					};
					var error = function(result) {
					};
					Api.reservationActivity(data, success, error);
				},
				getActivityCityList: function() {
					var self = this;
					var data = {
						auth: self.userId,
						token: self.token,
						info: {"activityId": self.activityId}
					};
					var success = function(result){
						if (result) {
							self.cityList = result.cityList;
							if (result.cityList && result.cityList.length > 0) {
								self.userInfo.city = result.cityList[0];
							}
						}
						
					};
					var error = function(result) {
					};
					Api.getActivityCityList(data, success, error);
				},
				getUserInfo: function() {
					var self = this;
					var data = {
						auth: self.userId,
						token: self.token,
						info: 'N'
					};
					var success = function(result){
						if (result) {
							if (result.userInfo) {
								self.userInfo.realName = result.userInfo.realname;
								self.userInfo.idcard = result.userInfo.idcard;
								self.userInfo.mobile = result.userInfo.mobile;
								self.userInfo.sex = result.userInfo.sex;
								
							}
						}
						
					};
					var error = function(result) {
					};
					Api.getActivityCityList(data, success, error);
				}
			},
			created: function () {
				var self = this;
				self.token_yzx = Utils.generateParameterMapByUrl(document.URL)['token_yzx'];
				self.activityId = Utils.generateParameterMapByUrl(document.URL)['activityId'];
        	self.token = Session.getToken();
	      	self.userId = Session.getUserId();
//	      	self.token = '96526bd2-92d3-47d1-a71d-13c2ebe6472c';
//	      	self.userId = '262';
				self.userInfo.sex = self.sexList[0].value;
	      	self.getActivityCityList();
			}
		});

		return vm;
	}

	return {
		init : function() {
			vm = initVue();

			var u = navigator.userAgent, app = navigator.appVersion;
		  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
		  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		  
			
			$.init();
		}
	}

}();