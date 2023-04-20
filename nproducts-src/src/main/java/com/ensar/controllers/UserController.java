package com.ensar.controllers;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

 

 

import javax.validation.Valid;

 

 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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
import com.ensar.models.ERole;
import com.ensar.models.Role;
import com.ensar.models.User;
import com.ensar.payload.request.SignupRequest;
import com.ensar.payload.request.UserAddRequest;
import com.ensar.payload.response.MessageResponse;
import com.ensar.payload.response.UserResponse;
import com.ensar.repository.RoleRepository;
import com.ensar.repository.UserRepository;
import com.ensar.security.services.UserDetailsImpl;
import com.ensar.security.services.UserDetailsServiceImpl;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/auth/user")
public class UserController {

   @Autowired
   private UserDetailsServiceImpl userDetailsService;

   @Autowired
   UserRepository userRepository;
   
   @Autowired
   RoleRepository roleRepository;

    @GetMapping("/current")
    public ResponseEntity<?> getLoggedInUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetailImpl = (UserDetailsImpl) authentication.getPrincipal();  
        UserResponse userResponse = userDetailsService.getUserByEmail(userDetailImpl.getEmail());
        HashMap<String, UserResponse> map = new HashMap<>();
        map.put("user", userResponse);

        return ResponseEntity.ok(map);
    }

     @GetMapping("/fetchuser")
     public ResponseEntity<?> all() {
        return ResponseEntity.ok(userRepository.findAll());
      }
    @PostMapping("/adduser")
    public ResponseEntity<?> adduser(@RequestBody UserAddRequest userAddRequest) {

        // Create new user's account
        User user = new User();
        user.setEmail(userAddRequest.getEmail());
        user.setFullName(userAddRequest.getFullName());
        user.setPhoneNumber(userAddRequest.getPhoneNumber());
        user.setAddress(userAddRequest.getAddress());
        user.setCity(userAddRequest.getCity());
        user.setCompany(userAddRequest.getCompany());
        user.setState(userAddRequest.getState());
        user.setZipcode(userAddRequest.getZipcode());
        user.setCountry(userAddRequest.getCountry());

        Set<String> strRoles = userAddRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
          Role userRole = roleRepository.findByName(ERole.ROLE_USER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(userRole);
        } else {
          strRoles.forEach(role -> {
            switch (role) {
            case "admin":
              Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                  .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
              roles.add(adminRole);

              break;
            case "mod":
              Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                  .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
              roles.add(modRole);

              break;
            default:
              Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                  .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
              roles.add(userRole);
            }
          });
        }

        user.setRoles(roles);
        
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User Added successfully!"));
      }

}