//package com.poly.be_duan.restcontrollers.admin;
//
//
//import com.poly.be_duan.entities.Cart;
//import com.poly.be_duan.service.CartService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
//
//@CrossOrigin("*")
//@RestController
//@RequestMapping("/api/cart")
//public class CartRestController {
//
//    @Autowired
//    CartService cartService;
//
//    @GetMapping()
//    public ResponseEntity<List<Cart>> getAll() {
//        System.out.println(cartService.getAll());
//        try {
//            return ResponseEntity.ok(cartService.getAll());
//        }catch (Exception e){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
//        }
//
//    }
//}
