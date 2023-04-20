package com.ensar.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@AllArgsConstructor
//@Setter
//@Getter
public class JwtResponse {
  private String accessToken;
  private UserResponse user = new UserResponse();
 

  public JwtResponse(String accessToken, Long id, String username, String email, String role) {
    this.accessToken = accessToken;
    user.setEmail(email);
    user.setId(id);
    user.setDisplayName(username);
    user.setRole(role);
  }


public String getAccessToken() {
	return accessToken;
}


public void setAccessToken(String accessToken) {
	this.accessToken = accessToken;
}


public UserResponse getUser() {
	return user;
}


public void setUser(UserResponse user) {
	this.user = user;
}


  
  
}
