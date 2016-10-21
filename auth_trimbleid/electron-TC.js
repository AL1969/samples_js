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
		var tIDUrl = "https://" + global.tidRoot + "/i/oauth2/authorize?";
		var authUrl = tIDUrl + "scope=openid&response_type=code" + "&redirect_uri=" + encodeURIComponent(global.redirectLocalURL) + "&client_id=" + global.consumerKey;

		console.log("login: authUrl=" + authUrl);

		browserWindow.loadURL(authUrl);
		browserWindow.show();

		function authorizeCallback (url, what) {
			console.log("login authorizeCallback: url='" + url + "' (" + what + ")");
			var raw_code = /code=([^&]*)/.exec(url) || null;
			var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
			var error = /\?error=(.+)$/.exec(url);
			console.log("login authorizeCallback: code='" + code + "' error=" + error + "'");

			if (code || error) {
				// Close the browser if code found or error
				browserWindow.loadURL('http://localhost:8888/auth_trimbleid/index.html');
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
			authorizeCallback(url, 'will-navigate');
		});

		browserWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
			authorizeCallback(newUrl, 'did-get-redirect-request');
		});

		// Get Trimble ID JWT
		function requestTID_JWT(code) {
			var instr = global.consumerKey + ":" + global.consumerSecret;
			var options = {
				host: 'identity-stg.trimble.com',
				path: '/i/oauth2/token?grant_type=authorization_code&tenantDomain=trimble.com&code=' + code + "&redirect_uri=" + encodeURIComponent(global.redirectLocalURL),
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
					console.log("requestTID_JWT - response BODY:\n**********\n" + chunk + "\n**********\n");
					var id_token = JSON.parse(chunk).id_token;
					console.log("requestTID_JWT - response id_token:\n**********\n" + id_token + "\n**********\n");
					var id_token_buf = new Buffer(id_token, 'base64');
					console.log("requestTID_JWT - response id_token_buf tostring:\n**********\n" + id_token_buf.toString('utf8') + "\n**********\n");
					browserWindow.loadURL(redirectURL);
				});
				res.on('end', () => {
					console.log("requestTID_JWT - response: No more data in response.");
				});
			});
			req.on('error', (error) => {
				console.log("requestTID_JWT - response error: " + error);
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

