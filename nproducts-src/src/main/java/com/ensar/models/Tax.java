package com.ensar.models;

import java.sql.Date;
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
@Table(name = "tax")
public class Tax {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long taxid;
  

  @NotBlank
  private Integer percentage;


public Long getTaxid() {
	return taxid;
}


public void setTaxid(Long taxid) {
	this.taxid = taxid;
}


public Integer getPercentage() {
	return percentage;
}


public void setPercentage(Integer percentage) {
	this.percentage = percentage;
}

 
}
