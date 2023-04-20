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
@Table(name = "answer")
public class Answer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long answerid;
  
 
  @OneToOne(fetch=FetchType.LAZY)
  @JoinColumn(name = "questionid", referencedColumnName="questionid")
  @JsonBackReference
  private Question question;


  public Long getAnswerid() {
	return answerid;
}

public void setAnswerid(Long answerid) {
	this.answerid = answerid;
}

public Question getQuestion() {
	return question;
}

public void setQuestion(Question question) {
	this.question = question;
}


public String getContent() {
	return content;
}

public void setContent(String content) {
	this.content = content;
}

public String getUserid() {
	return userid;
}

public void setUserid(String userid) {
	this.userid = userid;
}

public String getUsername() {
	return username;
}

public void setUsername(String username) {
	this.username = username;
}

public Timestamp getCreated() {
	return created;
}

public void setCreated(Timestamp created) {
	this.created = created;
}

@NotBlank
  private String content;

  @NotBlank
  @Size(max = 150)
  private String userid;

  @NotBlank
  @Size(max = 150)
  private String username;
  
  @NotBlank
  private Timestamp created;
  
}
