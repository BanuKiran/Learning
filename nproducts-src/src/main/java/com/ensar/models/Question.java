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
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Data;

@Entity
//@Data
@Table(name = "question")
public class Question {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long questionid;

  @NotBlank
  @Size(max = 100)
  private String title;

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
  
  
  @OneToMany(fetch = FetchType.LAZY,mappedBy="question")
  @JsonManagedReference
  private Set<Answer> answers;

public Long getQuestionid() {
	return questionid;
}

public void setQuestionid(Long questionid) {
	this.questionid = questionid;
}

public String getTitle() {
	return title;
}

public void setTitle(String title) {
	this.title = title;
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

public Set<Answer> getAnswers() {
	return answers;
}

public void setAnswers(Set<Answer> answers) {
	this.answers = answers;
}

  
}
