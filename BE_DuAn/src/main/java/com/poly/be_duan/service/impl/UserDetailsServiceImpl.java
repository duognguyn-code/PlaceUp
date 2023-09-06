package com.poly.be_duan.service.impl;

import com.poly.be_duan.entities.Account;
import com.poly.be_duan.entities.Author;
import com.poly.be_duan.repositories.AccountRepository;
import com.poly.be_duan.repositories.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final AccountRepository accountRepository;
    private final AuthorRepository authorRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.findByUsername(username);
        System.out.println(account.getPassword() + "passwworf dang nhap");
        System.out.println(account.getAuthorList());
        if (account == null){
            throw  new UsernameNotFoundException("account " + username+"not found");
        }
        return UserDetailsImpl.build(account);
    }
}
