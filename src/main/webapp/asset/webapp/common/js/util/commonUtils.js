/*!
* javascript common utils 0.1
* 
* Released under Free License
* 
* Author : JooYoung, Lee (spec98@hanmail.net, jy98.lee@samsung.com)
* Created : 2016-06-22          
* Updated : 2016-07-04      
*
*/

"use strict";

var contextRoot = document.URL.match(/[0-9a-zA-Z.\/\-:]*webapp/i)[0].replace("/webapp","");

// Store Option	
var customStorage = {
		write:function(key, value) {
			return localStorage.setItem(key, JSON.stringify(value));
		},
		read:function(key) {
			try {
				return JSON.parse(localStorage.getItem(key));
			}
			catch(e) {
				return localStorage.getItem(key);
			}			
		},
		remove:function(key) {
			return localStorage.removeItem(key);
		},
		isExist:function(key) {
			return localStorage.hasOwnProperty(key);
		},
		clearAll:function(key) {
			app.requestRemoveAll(key);
			return localStorage.clear();
		}
	};
	
// 공용  ajax 호출
function commonAjax(url, data, method, params) {
	// default parameters
	var ajaxParams = {
		requestType:"GET",
		requestsData:"",
		dataType:"json",
		contentType:"application/json; charset=UTF-8",
		successFunc:null,
		errorFunc:null,
		completeFunc:null
	};

	// set request parameters
	$.extend(ajaxParams, params);
	
	ajaxParams.url = url;
	if (["GET","POST","PUT","DELETE"].indexOf(method) != -1) {
		ajaxParams.type = method;
	}
	else {
		throw ServiceException("MSG_ERR_CALL".i18n());
	}
	var requestData = {};
	if (data != undefined) {
		if(typeof data == "string") {
			ajaxParams.data = data;
		}
		else if(typeof data == "object") {			
			ajaxParams.data = JSON.stringify(data);
		}
	} 
	
	// Show loading
	//loading.show();

	$.ajax({
		type : ajaxParams.type,
		url : ajaxParams.url,
		cache:false,
		dataType : ajaxParams.dataType,
		contentType : ajaxParams.contentType,
		data : ajaxParams.data,
		success : function(data, textStatus, jqXHR) {
			// Call success function
			if(ajaxParams.successFunc) {
				ajaxParams.successFunc(data, textStatus, jqXHR);
			}
		},
		/***************************************************************
		 * success : function(resultData) {
		 * eval(_succesFnc+"(resultData)"); },
		 **************************************************************/
		error : function(xhr, status, error) {
			loading.hide();
	
			alert("Internal server error");
			
			// Call error function
			if(ajaxParams.errorFunc) {
				ajaxParams.errorFunc(xhr, status, error);
			}
		},
		complete : function() {			
			// Call error function
			if(ajaxParams.completeFunc) {
				ajaxParams.completeFunc(xhr, status, error);
			}
		}
	});
}


var loading = {
	show:function(options) {
		var loadingId = "loading";
		var option = {
				message:"",
				timeout:null
		}
		$.extend(option, options);	
		
		var loadingId = "loading";
		var loadingWrap = $("<div>").addClass("loadingWrap").attr("id", loadingId);
		var dimBg = $("<div>").addClass("dim");
		var loadingIcon = $("<i class='fa fa-spinner fa-spin loading'></i>");
		loadingWrap.append(dimBg);
		loadingWrap.append(loadingIcon);
		if(option.message) {
			var loadingMessage = $("<div>").addClass("message").text(option.message);
			loadingWrap.append(loadingMessage);
		}
		
		$("body").append(loadingWrap);
		
		if(option.timeout) {
			setTimeout(function() {
				loading.hide(loadingId);
			}, option.timeout);
		}
	},
	hide:function() {
		var loadingId = "loading";
		if($("#" + loadingId).length) {
			$("#" + loadingId).remove();
		}
	}
}
