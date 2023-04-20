package com.ensar.payload.response;

 

public class UserAccessResponse {

 

private String accessToken;

private String UserName;

 

public UserAccessResponse(String accessToken, String UserName) {

this.accessToken = accessToken;

this.UserName = UserName;

}

public String getAccessToken() {

return accessToken;

}

 

public void setAccessToken(String accessToken) {

this.accessToken = accessToken;

}

 

public String getUserName() {

return UserName;

}

 

public void setUserName(String userName) {

UserName = userName;

}

 

 

}