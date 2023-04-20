package com.ensar.models;

import java.util.HashSet;

import java.util.Set;

import javax.persistence.*;

import javax.validation.constraints.Email;

import javax.validation.constraints.NotBlank;

import javax.validation.constraints.Size;

@Entity

@Table(name = "users",

uniqueConstraints = {

@UniqueConstraint(columnNames = "username"),

@UniqueConstraint(columnNames = "email")

})

public class User {

@Id

@GeneratedValue(strategy = GenerationType.IDENTITY)

private Long id;

@Size(max = 20)

private String username;

@Size(max = 50)

@Email

private String email;

@Size(max = 120)

private String password;

@ManyToMany(fetch = FetchType.LAZY)

@JoinTable( name = "user_roles",

joinColumns = @JoinColumn(name = "user_id"),

inverseJoinColumns = @JoinColumn(name = "role_id"))

private Set<Role> roles = new HashSet<>();

private String FullName;

private String phoneNumber;

private String country;

private String state;

private String city;

private String Address;

private String Zipcode;

private String company;

public User() {

}

public User(String username, String email, String password) {

this.username = username;

this.email = email;

this.password = password;

}

public Long getId() {

return id;

}

public void setId(Long id) {

this.id = id;

}

public String getUsername() {

return username;

}

public void setUsername(String username) {

this.username = username;

}

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

public Set<Role> getRoles() {

return roles;

}

public void setRoles(Set<Role> roles) {

this.roles = roles;

}

public String getFullName() {

return FullName;

}

public void setFullName(String fullName) {

FullName = fullName;

}

public String getPhoneNumber() {

return phoneNumber;

}

public void setPhoneNumber(String phoneNumber) {

this.phoneNumber = phoneNumber;

}

public String getCountry() {

return country;

}

public void setCountry(String country) {

this.country = country;

}

public String getState() {

return state;

}

public void setState(String state) {

this.state = state;

}

public String getCity() {

return city;

}

public void setCity(String city) {

this.city = city;

}

public String getAddress() {

return Address;

}

public void setAddress(String address) {

Address = address;

}

public String getZipcode() {

return Zipcode;

}

public void setZipcode(String zipcode) {

Zipcode = zipcode;

}

public String getCompany() {

return company;

}

public void setCompany(String company) {

this.company = company;

}

}