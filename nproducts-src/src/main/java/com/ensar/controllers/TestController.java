package com.ensar.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {
	

	private static final AWSCredentials credentials;
    private static String bucketName;  

    static {
        //put your accesskey and secretkey here
        credentials = new BasicAWSCredentials(
          "KEY", 
          "Secret"
        );
    }
    
  @GetMapping("/all")
  public String allAccess() {
    return "Public Content.";
  }

  @GetMapping("/user")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public String userAccess() {
    return "User Content.";
  }

  @GetMapping("/mod")
  @PreAuthorize("hasRole('MODERATOR')")
  public String moderatorAccess() {
    return "Moderator Board.";
  }

  @GetMapping("/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public String adminAccess() {
    return "Admin Board.";
  }
  
  @GetMapping("/s3")
  //@PreAuthorize("hasRole('ADMIN')")
  public String s3() {
	  AmazonS3 s3client = AmazonS3ClientBuilder
	          .standard()
	          .withCredentials(new AWSStaticCredentialsProvider(credentials))
	          .withRegion(Regions.US_WEST_2)
	          .build();
	
      bucketName = "apollo-na";
      ObjectListing objectListing = s3client.listObjects(bucketName);
     
      for(S3ObjectSummary os : objectListing.getObjectSummaries()) {
          System.out.println(os.getKey());
      }
    return "Admin Board.";
  }
  
}
