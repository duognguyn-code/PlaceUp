package com.poly.be_duan.restcontrollers.admin;


import com.poly.be_duan.dto.AccountDTO;
import com.poly.be_duan.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/rest/user")
public class UserRestControllerAdmin {

    @Autowired
    private AccountService accountService;
    @PostMapping("/updateAccountActive")
    public AccountDTO updateAccountActive(@RequestBody AccountDTO accountDTO){
        return accountService.updateAccountActive(accountDTO);
    }

}
