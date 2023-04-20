package com.ensar.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.ensar.models.Customer;
import com.ensar.service.CustomerService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/customer")
public class CustomerController {
	

	@Autowired
	CustomerService customerService;
    
  @GetMapping("/")
  public ResponseEntity<?> allAccess() {
    return ResponseEntity.ok(customerService.getAll());
  }

  @PostMapping("/")
  //@PreAuthorize("hasRole('ROLE_SUPER_ADMIN')")
  public ResponseEntity<Customer> create(@Valid @RequestBody Customer customer) {
      return ResponseEntity.ok(customerService.createOrUpdate(customer));
  }
  
  
  @DeleteMapping("/{id}")
  public ResponseEntity<Boolean> deleteUser(@PathVariable("id") long id) {
	  return ResponseEntity.ok(customerService.delete(id));
  }
  
}
