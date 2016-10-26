@echo off

set code=38707c494409a1b8b96bf6821f8d410

set rediruri=http%3A%2F%2Flocalhost%3A8888%2Fauth_trimbleid%2Foauth_after.html
rem set rediruri=http://localhost:8888/auth_trimbleid/oauth_after.html
set authstr=SEE3NG02UFBZN1NzX19zejBVTVVER2ltTVlZYTpYcFZxQmYyY1kyZ0UwVzdxeUhZOXNPdFBOZmdh
rem curl -v -k -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic %authstr%" -H "Accept: application/json" -H "Cache-Control: no-cache" "https://identity-stg.trimble.com/i/oauth2/token?grant_type=authorization_code&tenantDomain=trimble.com&code=%code%&redirect_uri=%rediruri%"

rem curl -v -k -H "Host: identity-stg.trimble.com" -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic %authstr%" -H "Accept: application/json" -H "Cache-Control: no-cache" --data "grant_type=authorization_code&tenantDomain=trimble.com&code=%code%&redirect_uri=%rediruri%" "https://identity-stg.trimble.com/i/oauth2/token"
rem curl -v -k -H "Host: identity-stg.trimble.com" -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic %authstr%" -H "Accept: application/json" -H "Cache-Control: no-cache" -d "grant_type=authorization_code" -d "tenantDomain=trimble.com" -d "code=%code%" -d "redirect_uri=%rediruri%" "https://identity-stg.trimble.com/i/oauth2/token"
rem curl -k -H "Host: identity-stg.trimble.com" -H "Authorization: Basic %authstr%" -H "Content-Type: application/x-www-form-urlencoded" -H "Accept: application/json" -H "Cache-Control: no-cache" -d "grant_type=authorization_code" -d "code=%code%" -d "redirect_uri=%rediruri%" -d "tenantDomain=trimble.com" https://identity-stg.trimble.com/i/oauth2/token --trace-ascii xcurl_trace.txt
rem curl -k -H "Host: identity-stg.trimble.com" -H "Authorization: Basic %authstr%" -H "Content-Type: application/x-www-form-urlencoded" -H "Accept: application/json" -H "Cache-Control: no-cache" --data-ascii "grant_type=authorization_code" --data-ascii "code=%code%" --data-ascii "redirect_uri=%rediruri%" --data-ascii "tenantDomain=trimble.com" https://identity-stg.trimble.com/i/oauth2/token --trace-ascii xcurl_trace.txt
curl -k -X POST -H "Host: identity-stg.trimble.com" -H "Authorization: Basic %authstr%" -H "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" -H "Accept: application/json" -H "Cache-Control: no-cache" --data "grant_type=authorization_code" --data "code=%code%" --data "redirect_uri=%rediruri%" --data "tenantDomain=trimble.com" https://identity-stg.trimble.com/i/oauth2/token --trace-ascii xcurl_trace.txt

