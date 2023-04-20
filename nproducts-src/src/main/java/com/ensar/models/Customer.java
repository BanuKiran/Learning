package com.ensar.models;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Entity
//@Data
@Table(name = "customer")
public class Customer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long customerid;
  

  @NotBlank
  private String name;


public Long getCustomerid() {
	return customerid;
}


public void setCustomerid(Long customerid) {
	this.customerid = customerid;
}


public String getName() {
	return name;
}


public void setName(String name) {
	this.name = name;
}

  
  

  
}
