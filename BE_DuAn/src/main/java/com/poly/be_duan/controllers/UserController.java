package com.poly.be_duan.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value="/user")
@CrossOrigin("*")
public class UserController {

    @GetMapping
    public String home() {
        return "redirect:/user/index.html";
    }
}
