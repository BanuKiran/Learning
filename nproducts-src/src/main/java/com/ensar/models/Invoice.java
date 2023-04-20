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
@Table(name = "invoice")
public class Invoice {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long invoiceid;
  

  @NotBlank
  private String name;

  @NotBlank
  @Size(max = 150)
  private Integer invoiceNumber;

  @NotBlank
  @Size(max = 150)
  private Integer totalPrice;
  

  @NotBlank
  private Date createDate;
  
  @NotBlank
  private Date dueDate;
  
  @NotBlank
  private String staus;
  
  public Long getInvoiceid() {
	return invoiceid;
}

public void setInvoiceid(Long invoiceid) {
	this.invoiceid = invoiceid;
}

public String getName() {
	return name;
}

public void setName(String name) {
	this.name = name;
}

public Integer getInvoiceNumber() {
	return invoiceNumber;
}

public void setInvoiceNumber(Integer invoiceNumber) {
	this.invoiceNumber = invoiceNumber;
}

public Integer getTotalPrice() {
	return totalPrice;
}

public void setTotalPrice(Integer totalPrice) {
	this.totalPrice = totalPrice;
}

public Date getCreateDate() {
	return createDate;
}

public void setCreateDate(Date createDate) {
	this.createDate = createDate;
}

public Date getDueDate() {
	return dueDate;
}

public void setDueDate(Date dueDate) {
	this.dueDate = dueDate;
}

public String getStaus() {
	return staus;
}

public void setStaus(String staus) {
	this.staus = staus;
}

public Tax getTax() {
	return tax;
}

public void setTax(Tax tax) {
	this.tax = tax;
}

@OneToOne
@JoinColumn(name = "taxid", referencedColumnName="taxid")
private Tax tax;
  
}
