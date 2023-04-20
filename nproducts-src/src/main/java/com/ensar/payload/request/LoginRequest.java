package com.ensar.payload.request;

import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;


//@Setter
//@Getter
public class LoginRequest {
	@NotBlank
  private String email;

	@NotBlank
	private String password;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
