'use strict';

function logout() {
	var tIDUrl = 'https://identity-stg.trimble.com/i/commonauth?commonAuthLogout=true&type=samlsso&sessionDataKey=E294FEF4A64BF7E14940E2964F78E351';
	var redirectLocalURL = 'http://localhost:8888/auth_trimbleid/loggedout.html';
	var logoutUrl = tIDUrl + "&commonAuthCallerPath=" + encodeURIComponent(redirectLocalURL);
	//alert("logout: logoutUrl='" + logoutUrl + "'");
	console.log("logout: logoutUrl='" + logoutUrl + "'");
	location.href = logoutUrl;
}

