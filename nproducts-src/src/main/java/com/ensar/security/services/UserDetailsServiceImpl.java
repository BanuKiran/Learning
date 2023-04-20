package com.ensar.security.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ensar.models.User;
import com.ensar.payload.response.UserResponse;
import com.ensar.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  @Autowired
  UserRepository userRepository;
  
  //private MapStructMapper mapstructMapper;


  @Override
  @Transactional
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

    return UserDetailsImpl.build(user);
  }

  @Transactional
  public UserResponse getUserByEmail(String username) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

      
    UserResponse userResponse = new UserResponse();
	userResponse.setId(user.getId());
	userResponse.setEmail(user.getEmail());
	userResponse.setDisplayName(user.getUsername());
	userResponse.setRole(user.getRoles().stream().findFirst().get().getName().name());
	
	
    return userResponse;
  }
}
