'use strict';


const https = require('https');
const electron = require('electron');
//var http = require('http');

// Module to create native browser window.
const {BrowserWindow} = electron;
const {session} = electron;

/* 
 * this line of code re-assigns  
 * module.exports
 */
module.exports = {

	login: function(redirectURL, browserWindow) {
		redirectURL = redirectURL || 'http://localhost';
		var redirectLocalURL = "http://localhost";

		// Authorize
		//var tIDUrl = 'https://identity.trimble.com/i/oauth2/authorize?';
		//var authUrl = tIDUrl + "tenantDomain=trimble.com" + '&client_id=GQNj3Gm9LzXSfBgLY65lNrUcp1wa' + '&scope=openid' + 
		//                "&redirect_uri=" + encodeURIComponent(redirectLocalURL) + "&response_type=code";
		var tIDUrl = 'https://identity-stg.trimble.com/i/oauth2/authorize?';
		var redirectLocalURL = 'http://localhost:8888/auth_trimbleid/oauth_after.html';
		var authUrl = tIDUrl + "scope=openid&response_type=code" + "&redirect_uri=" + encodeURIComponent(redirectLocalURL) + '&client_id=HA74m6PPY7Ss__sz0UMUDGimMYYa';

		console.log("login: authUrl=" + authUrl);

		browserWindow.loadURL(authUrl);
		browserWindow.show();

		function authorizeCallback (url) {
			var raw_code = /code=([^&]*)/.exec(url) || null;
			var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
			var error = /\?error=(.+)$/.exec(url);
			console.log("login authorizeCallback: code=" + code + " error=" + error);

			if (code || error) {
				// Close the browser if code found or error
				//browserWindow.loadURL('file:///login/index.html');
				browserWindow.loadURL('http://localhost:8888');
			}

			// If there is a code, proceed to get token from github
			if (code) {
				requestTID_JWT(code);
			}
			else if (error) {
				alert('Oops! Something went wrong and we couldn\'t' + 'log you in. Please try again.');
			}
		}

		// Handle the response from GitHub - See Update from 4/12/2015
		browserWindow.webContents.on('will-navigate', function (event, url) {
			authorizeCallback(url);
		});

		browserWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
			authorizeCallback(newUrl);
		});

		// Get Trimble ID JWT
		function requestTID_JWT(code) {
			var instr = "HA74m6PPY7Ss__sz0UMUDGimMYYa:XpVqBf2cY2gE0W7qyHY9sOtPNfga";
			var options = {
				host: 'identity-stg.trimble.com',
				path: '/i/oauth2/token?grant_type=authorization_code&tenantDomain=trimble.com&code=' + code + "&redirect_uri=" + encodeURIComponent(redirectLocalURL),
				method: "POST",
				//This is the only line that is new. `headers` is an object with the headers to request
				headers: {"Content-Type": "application/x-www-form-urlencoded",
					"Authorization": "Basic " + new Buffer(instr).toString('base64'),
					"Accept": "application/json",
					"Cache-Control": "no-cache"
				}
			};
			console.log("requestTID_JWT: code=" + code);

			var req = https.request(options, (res) => {
				res.setEncoding('utf-8');
				res.on('data', (chunk) => {
					//requestTC_JWT(JSON.parse(chunk).id_token);
					console.log(`BODY: ${chunk}`);
				});
				res.on('end', () => {
					console.log('No more data in response.');
				});
			});
			req.on('error', (error) => {
				console.log(error);
			});
			// write data to request body
			req.end();
		}

		// Get Trimble Connect JWT
		function requestTC_JWT(TIDJWT) {
			var options = {
				host: 'app.prod.gteam.com',
				path: '/tc/api/2.0/auth/token',
				method: "POST",
				//This is the only line that is new. `headers` is an object with the headers to request
				headers: {"Content-Type": "application/json" }
			};

			var req = https.request(options, (res) => {
				res.setEncoding('utf-8');
				res.on('data', (chunk) => {
				// store cookie with fake URL
				const cookie = {url: "http://ecognition.orion.com", name: 'tc_jwt', value: JSON.parse(chunk).token};
				/*session.defaultSession.cookies.set(cookie, (error) => {
				var filter = {url: redirectURL, name: 'tc_jwt' };
				session.defaultSession.cookies.get(filter, (error, cookies) => {
				//alert(cookies);
				});
				if (error) 
				console.error(error)
				})*/
				// create dynamic property of the browser window to be accessed in renderer process
				browserWindow.tcToken = cookie.value;
				// start angular application
				browserWindow.loadURL(redirectURL);
				//console.log(`BODY: ${chunk}`);
				});
				res.on('end', () => {
				//console.log('No more data in response.');
				});
			});
			req.on('error', (error) => {
				console.log(error);
			});
			// write data to request body
			req.write(JSON.stringify({jwt: TIDJWT}));
			req.end();
		}
	}
}

