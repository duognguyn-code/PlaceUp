package com.poly.be_duan.restcontrollers.admin;

import com.poly.be_duan.dto.SignUpDTO;
import com.poly.be_duan.entities.Account;
import com.poly.be_duan.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/account")
public class AccountRestController {

    @Autowired
    AccountService accountService;

    @Autowired
    PasswordEncoder passwordEncoder;


    @PostMapping
    public Account create(@RequestBody SignUpDTO signUpDTO) {
        LocalDate today = LocalDate.now();
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        String date = today.format(dateTimeFormatter);
        Date dates1 = new Date(date);
        Account account = new Account();
        account.setDate(dates1);
        account.setStatus(1);
        account.setPassword(passwordEncoder.encode(signUpDTO.getPassword()));
        account.setEmail(signUpDTO.getEmail());
        account.setPhone(signUpDTO.getPhone());
        account.setFullName(signUpDTO.getFullName());
        account.setUsername(signUpDTO.getUsername());
        return accountService.save(account);
    }

    @GetMapping
    public List<Account>getAll(){
        return accountService.getAll();
    }

    @GetMapping("/findByUsername/{username}")
    public Account findByUsername(@PathVariable(value = "username")String username){
        return accountService.findByUsername(username);
    }

    @GetMapping("/checkusername/{username}")
    public Account findByNameForcheckUsername(@PathVariable(value = "username")String username){
        return accountService.findByNameForcheckUsername(username);
    }
    @PutMapping
    public Account update(@RequestBody Account account){

        return accountService.save(account);
    }

    @DeleteMapping("/{username}")
    public void delete(@PathVariable(value = "username")String username){
        accountService.deleteById(username);
    }

    @GetMapping("/findByPhone/{phone}")
    public Account findByPhone(@PathVariable(value = "phone")String phone){
        System.out.println(accountService.findByPhone(phone));
        return accountService.findByPhone(phone);
    }

}

