package com.poly.be_duan.controllers;

import com.poly.be_duan.entities.Account;
import com.poly.be_duan.service.AccountService;
import com.poly.be_duan.utils.Username;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class LoginController {
    @Autowired
    private AccountService accountService;
    @RequestMapping("/login")
    public String loginForm(Model model) {

        return "redirect:/user/index.html#!/login";
    }
    @GetMapping("/rest/account")
    @ResponseBody
    public Account account() {
        Account account = accountService.findByUsername(Username.getUserName());
        return account;
    }
    @RequestMapping("/security/login/success")
    public String loginSuccess(Model model) {
        model.addAttribute("message", "Đăng nhập thành công!");
        return "redirect:/user/index.html#!";
    }
    @RequestMapping("/security/login/error")
    public String loginError(Model model) {

        model.addAttribute("error", "Tài khoản không hoạt động hoặc sai thông tin");
        System.out.println("Tài khoản không hoạt động hoặc sai thông tin");

        return "redirect:/user/index.html#!/login";

    }

    @RequestMapping("/security/unauthoried")
    public String unauthoried(Model model) {
        model.addAttribute("message", "Không có quyền truy xuất");

        model.addAttribute("message","Sai thông tin đăng nhập");
        return "redirect:/user/index.html#!/login";

    }
    @RequestMapping("/security/logoff/success")
    public String logoffSucess(Model model) {
        model.addAttribute("message", "Bạn đã đăng xuất!");

        return "redirect:/user/index.html#!";

    }
    @RequestMapping("/security/login")
    public String login() {
        System.out.println("Bạn đang thực hiện login");
        return null;
    }
}
