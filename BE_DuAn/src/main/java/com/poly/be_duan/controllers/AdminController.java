package com.poly.be_duan.controllers;

import com.poly.be_duan.entities.Product;
import com.poly.be_duan.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.websocket.server.PathParam;
import java.util.List;

@Controller
@RequestMapping(value="/admin")
@CrossOrigin("*")
@RequiredArgsConstructor
public class AdminController {
    private final ProductService productService;

    @GetMapping
    public String home() {
        return "redirect:/admin/main.html";
    }


}