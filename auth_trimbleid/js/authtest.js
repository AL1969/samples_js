'use strict';

function auth_TID() {
	var tIDUrl = 'https://identity-stg.trimble.com/i/oauth2/authorize?';
	var redirectLocalURL = 'http://localhost:8888/auth_trimbleid/oauth_after.html';
	var authUrl = tIDUrl + "scope=openid&response_type=code" + "&redirect_uri=" + encodeURIComponent(redirectLocalURL) + '&client_id=HA74m6PPY7Ss__sz0UMUDGimMYYa';
	console.log("auth_TID: authUrl='" + authUrl + "'");
	var loginwin = window.open(authUrl, "windowname1", 'width=800, height=600');
	var pollTimer = window.setInterval(function() {
		try {
			//console.log(win.document.URL);
			if (loginwin.document.URL.indexOf(redirectLocalURL) != -1) {
				window.clearInterval(pollTimer);
				var url = loginwin.document.URL;
				console.log("url=" + url);
				var raw_code = /code=([^&]*)/.exec(url) || null;
				console.log("raw_code=" + raw_code);
				var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
				console.log("code=" + code);
				var error = /\?error=(.+)$/.exec(url);
				console.log("error=" + error);
				loginwin.close();
				if (code || error) {
					// Close the browser if code found or error
					//browserWindow.loadURL('file:///login/index.html');
					console.log("loadurl");
					location.href = redirectLocalURL;
				}

				// If there is a code, proceed to get token from github
				if (code) {
					//requestTID_JWT(code);
					auth_next(code);
				}
				else if (error) {
					//alert('Oops! Something went wrong and we couldn\'t' + 'log you in. Please try again.');
					console.log("ERROR");
				}
				//auth_next();
			}
		} catch(exc) {
			console.log("auth_TID exc=" + exc);
		}
	}, 100);

}

function auth_next(code) {
	console.log("auth_next: code=" + code);
	var redirectLocalURL = 'http://localhost:8888/auth_trimbleid/oauth_after.html';
	var instr = "HA74m6PPY7Ss__sz0UMUDGimMYYa:XpVqBf2cY2gE0W7qyHY9sOtPNfga";
	var encstr = window.btoa(instr);

           var options = {
            host: 'identity-stg.trimble.com',
            path: '/i/oauth2/token?grant_type=authorization_code&tenantDomain=trimble.com&code=' + code + "&redirect_uri=" + encodeURIComponent(redirectLocalURL),
            method: "POST",
            //This is the only line that is new. `headers` is an object with the headers to request
            headers: {"Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": "Basic " + encstr,
                        "Accept": "application/json",
                        "Cache-Control": "no-cache"
                    }
            };

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


// AuthorizationEndpoint = "https://identity-stg.trimble.com/i/oauth2/authorize",
// TokenEndpoint = "https://identity-stg.trimble.com/i/oauth2/token",
// UserInformationEndpoint = "https://identity-stg.trimble.com/userinfo?schema=openid",


// To obtain the authorization code, redirect the browser to authorize endpoint URL provided below. The URL contains the following query parameters:
// scope=openid
// response_type=code
// redirect_uri= <Redirect URL registered with TID>
// client_id= <ClientID registered for the application>

// A sample request that is sent at this stage is provided below:
// https://identity-stg.trimble.com/i/oauth2/authorize?scope=openid&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fplayground%2Foauth2client&client_id=WCD9DsSDxBSZDsfTkSR2rPAQqWIa


// Consumer Key : HA74m6PPY7Ss__sz0UMUDGimMYYa
// Consumer Secret : XpVqBf2cY2gE0W7qyHY9sOtPNfga
