@echo off

set code=6c6fa7463645cf1d6c9b05e6dcd4128

set rediruri=http%3A%2F%2Flocalhost%3A8888%2Fauth_trimbleid%2Foauth_after.html
set authstr=SEE3NG02UFBZN1NzX19zejBVTVVER2ltTVlZYTpYcFZxQmYyY1kyZ0UwVzdxeUhZOXNPdFBOZmdh
curl -v -k -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic %authstr%" -H "Accept: application/json" -H "Cache-Control: no-cache" "https://identity-stg.trimble.com/i/oauth2/token?grant_type=authorization_code&tenantDomain=trimble.com&code=%code%&redirect_uri=%rediruri%"
