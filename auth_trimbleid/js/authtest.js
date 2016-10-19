'use strict';

function auth_TID() {
	var tIDUrl = 'https://identity-stg.trimble.com/i/oauth2/authorize?';
	var redirectLocalURL = 'http://localhost:8888/auth_trimbleid/oauth_after.html';
	var authUrl = tIDUrl + "scope=openid&response_type=code" + "&redirect_uri=" + encodeURIComponent(redirectLocalURL) + '&client_id=HA74m6PPY7Ss__sz0UMUDGimMYYa';
	console.log("auth_TID: authUrl='" + authUrl + "'");

 var win         =   window.open(authUrl, "windowname1", 'width=800, height=600'); 

            var pollTimer   =   window.setInterval(function() { 
                try {
                    console.log(win.document.URL);
                    if (win.document.URL.indexOf(redirectLocalURL) != -1) {
                        window.clearInterval(pollTimer);
                        var url =   win.document.URL;
						console.log("url=" + url);
                        //var acToken =   gup(url, 'access_token');
						//console.log("acToken=" + acToken);
                        //var tokenType = gup(url, 'token_type');
 						//console.log("tokenType=" + tokenType);
                       //var expiresIn = gup(url, 'expires_in');
						//console.log("expiresIn=" + expiresIn);
						
						            var raw_code = /code=([^&]*)/.exec(url) || null;
 						console.log("raw_code=" + raw_code);
           var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
						console.log("code=" + code);
            var error = /\?error=(.+)$/.exec(url);
						console.log("error=" + error);

                        win.close();

                        //validateToken(acToken);
						auth_next();
                    }
                } catch(e) {
					console.log("e=" + e);
                }
            }, 100);

}

function auth_next() {
	console.log("auth_next");
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
