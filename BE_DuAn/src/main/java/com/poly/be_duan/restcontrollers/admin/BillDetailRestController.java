package com.poly.be_duan.restcontrollers.admin;

import com.fasterxml.jackson.databind.JsonNode;
import com.poly.be_duan.entities.Bill;
import com.poly.be_duan.entities.Bill_detail;
import com.poly.be_duan.entities.Product;
import com.poly.be_duan.service.BillDetailService;
import com.poly.be_duan.service.BillService;
import com.poly.be_duan.service.CookieService;
import com.poly.be_duan.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/billDetail")
public class BillDetailRestController {

    @Autowired
    BillDetailService billDetailService;

    @Autowired
    CookieService cookieService;

    @Autowired
    BillService billService;

    @Autowired
    ProductService productService;

    @GetMapping("/{id}")
    public ResponseEntity<List<Bill_detail>> getBill_detailByBillID(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(billDetailService.getBill_detail(id));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    @GetMapping("/forQuantityProduct/{id}")
    public Optional<Bill_detail> getBill_detail(@PathVariable(value = "id") Integer id) {
        System.out.println( billDetailService.findById(id));
            return billDetailService.findById(id);
    }
    @GetMapping("/forMoney/{id}")
    public ResponseEntity<List<Bill_detail>> getBill_detailForMoney(@PathVariable Integer id) {
        try {
            System.out.println("abc");
            return ResponseEntity.ok(billDetailService.getBill_detailForMoney(id));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    @GetMapping("/getBillByID")
    public List<Bill> getBillByID() {
        int a = Integer.parseInt(cookieService.getValue("id",""));
        return billService.getBill(a);
    }

        @PutMapping("{id}")
        public Bill update(@PathVariable("id") Integer id,@RequestBody Bill bill) {
            return billService.updateStatus(bill);
        }
        @PutMapping("/updateBillDetail")
        public Bill_detail update(@RequestBody Bill_detail bill_detail) {
            List<Bill_detail> billDT = billService.findByMoneyShipOnBillDetail(bill_detail.getBill().getId());
            if (bill_detail.getStatus()==5){
            if (billDT.get(0).getBill().getTypePayment()==false) {
                if (billDT.size() == 1) {
                    System.out.println("1------------------------------------");
                    BigDecimal quantity = BigDecimal.valueOf(bill_detail.getQuantity());
                    bill_detail.setMoneyRefund((quantity.multiply(bill_detail.getPrice())).add(billDT.get(0).getBill().getMoneyShip()));

                    return billDetailService.update(bill_detail);
                } else {
                    System.out.println("2------------------------------------");
                    BigDecimal quantity = BigDecimal.valueOf(bill_detail.getQuantity());
                    bill_detail.setMoneyRefund(quantity.multiply(bill_detail.getPrice()));
                    return billDetailService.update(bill_detail);
                }
            }else{
                return billDetailService.update(bill_detail);
            }
            }else{
                return billDetailService.update(bill_detail);
            }
        }
    @PutMapping("/updateBillDetail1")
    public Bill_detail update1(@RequestBody Bill_detail bill_detail) {
        List<Bill_detail> billDT = billService.findByMoneyShipOnBillDetail1(bill_detail.getBill().getId());
        if (bill_detail.getStatus()==5){
            if (billDT.get(0).getBill().getTypePayment()==false) {
                if (billDT.size() == 1) {
                    System.out.println("1------------------------------------");
                    BigDecimal quantity = BigDecimal.valueOf(bill_detail.getQuantity());
                    bill_detail.setMoneyRefund((quantity.multiply(bill_detail.getPrice())).add(billDT.get(0).getBill().getMoneyShip()));

                    return billDetailService.update(bill_detail);
                } else {
                    System.out.println("2------------------------------------");
                    BigDecimal quantity = BigDecimal.valueOf(bill_detail.getQuantity());
                    bill_detail.setMoneyRefund(quantity.multiply(bill_detail.getPrice()));
                    return billDetailService.update(bill_detail);
                }
            }else{
                return billDetailService.update(bill_detail);
            }
        }else{
            return billDetailService.update(bill_detail);
        }
    }


    @GetMapping(value="/rest/user/{id}")
    public List<Bill_detail> getAllUserByAccount(@PathVariable("id") Integer id){
        Optional<Bill> bill = billService.findById(id);
        List<Bill_detail> billDetails = billDetailService.findAllByOrder(bill.get());
        return billDetails;
    }



    @PutMapping("/UpdateBillDetaillByStatusBill/{status}/{id}")
    public Bill_detail UpdateBillDetaillByStatusBill(@PathVariable(value = "status")Integer status,@PathVariable(value = "id")Integer id) {
        if (status==3){
            status=2;
        }
        if (status==4){
            status=2;
        }
        System.out.println("an");
//        BigDecimal money = BigDecimal.valueOf(0);
        List<Bill_detail> detail = billDetailService.getBill_detail(id);
        for (int i = 0; i < detail.toArray().length; i++) {

            if (detail.get(i).getStatus() !=5){
                if(status == 5 || status==7){
                    Product products = productService.getId(detail.get(i).getProduct().getId());
                    products.setQuantity(products.getQuantity()+detail.get(i).getQuantity());
                    productService.save(products);
                   if (detail.get(i).getBill().getTypePayment()==false) {
                       BigDecimal quantity = BigDecimal.valueOf(detail.get(i).getQuantity());
                       BigDecimal money = quantity.multiply(detail.get(i).getPrice());
                       detail.get(i).setMoneyRefund(money);
                   }
                }
                detail.get(i).setStatus(status);
                billDetailService.save(detail.get(i));
            }
        }
        return null;
    }
    @PutMapping("/updatedt")
    public List<Product> savealldt(@RequestBody JsonNode products) {
        System.out.println("ok");
        return billDetailService.savealldt(products);
//        return billDetailService.savealldt(bill_detail);
    }



}
