package com.ensar.service;


import lombok.extern.log4j.Log4j2;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ensar.models.Customer;
import com.ensar.repository.CustomerRepository;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@Transactional
public class CustomerService{

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private CustomerRepository customerRepository;

    
    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
        
    }

   
    public List<Customer> getAll() {
        
    	List<Customer> list = customerRepository.findAll();
    	
    	return list;

        
    }
    
    public Customer createOrUpdate(Customer customer) {
     
        
        return customerRepository.save(customer);
    }

    
    public boolean delete(long id) {
    	Customer customer = customerRepository.findById(id)
          .orElseThrow(() -> new IllegalArgumentException("Customer Id:" + id));
        customerRepository.delete(customer);
        return true;
    }
}
