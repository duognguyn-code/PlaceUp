package com.poly.be_duan.service;

import com.poly.be_duan.dto.LoginDTO;
import com.poly.be_duan.dto.SignUpDTO;
import com.poly.be_duan.entities.Account;
import com.poly.be_duan.entities.Author;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AuthService {
    ResponseEntity<?> registerUser(SignUpDTO SignUpDTO);
    ResponseEntity<?> authenticateUser(LoginDTO loginDTO);

    Author save(Author author);

    List<Author>findAll();
    List<Author> searchAllAccount(String username, String phone, String fullName, String email, Integer status, String roldeName);
    List<Author> searchAccountNoStatus(String username, String phone, String fullName, String email, String roldeName);
    public List<Author> searchAccountNoUsername(String phone, String fullName, String email, Integer status, String roldeName);

    public List<Author> searchAccountNoUsernameNoStatus(String phone, String fullName, String email, String roldeName);
    Author searchAccountByUsername(String username);

    Author getRoleByUserName(String userName);


}
