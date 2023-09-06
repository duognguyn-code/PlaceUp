package com.poly.be_duan.restcontrollers.admin;

import com.fasterxml.jackson.databind.JsonNode;
import com.poly.be_duan.entities.Bill;
import com.poly.be_duan.entities.Bill_detail;
import com.poly.be_duan.entities.Product;
import com.poly.be_duan.entities.ProductChange;
import com.poly.be_duan.service.*;
import com.poly.be_duan.utils.Username;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value= "/rest/staff/productchange")
@CrossOrigin("*")
@RequiredArgsConstructor
public class QLProductChangeRestController {
    private final ProductChangeService productChangeService;

    private final BillDetailService billDetailService;

    private final SendMailService sendMailService;
    private final ProductService productService;
    private final BillService billService;

    @RequestMapping(value = "/comfirmRequest", method = RequestMethod.POST)
    public void confirmRequest(@RequestBody List<Integer> id){
        Bill_detail bill_detail = null;
        for (Integer s: id) {
            ProductChange productChange = productChangeService.findByStatus(s);
            System.out.println(productChange + "id");
            if(s != null && productChange.getStatus() == 1){
                productChange.setStatus(2);
                productChange.setUsernameUpdate(Username.getUserName());
                productChangeService.save(productChange);
                bill_detail = productChange.getBillDetail();
                BigDecimal aa = BigDecimal.valueOf(productChange.getQuantityProductChange());
                bill_detail.setStatus(4);
                bill_detail.setQuantity(bill_detail.getQuantity()-productChange.getQuantityProductChange());
                bill_detail.setMoneyRefund(aa.multiply(bill_detail.getPrice()));
                billDetailService.update(bill_detail, bill_detail.getId());
                System.out.println("------------------------------------");
                System.out.println(productChange.getQuantityProductChange()+"---------");
                System.out.println("gửi mail thành công");
            }else if(s != null && productChange.getStatus() == 2){
                productChange.setStatus(3);
                productChangeService.save(productChange);
                bill_detail = productChange.getBillDetail();
                bill_detail.setStatus(5);

                billDetailService.update(bill_detail, bill_detail.getId());
                int productChangeQuantity = productChange.getQuantityProductChange();
                Product product = productChange.getBillDetail().getProduct();
                int currentProductQuantity = product.getQuantity();
                product.setQuantity(currentProductQuantity + productChangeQuantity);
                productService.save(product);
                System.out.println("gửi mail thành công");
            }else {
                System.out.println("null lỗi");
            }
        }
    }

    @RequestMapping(value = "/cancelRequest", method = RequestMethod.POST)
    public void   cancelRequest(@RequestBody List<Integer>  idProductChange){
        for ( Integer  s :  idProductChange) {
            if(s !=null) {
                ProductChange product = productChangeService.findByStatus(s);
                if(product.getStatus()==1){
                    product.setStatus(5);
                    productChangeService.save(product);
                }else if(product.getStatus()==4){
                    System.out.println("không thể hủy ");
                }
            }
        }
    }
    @PostMapping("/prdList")
    public List<ProductChange> getListProductChange(@RequestBody List<Integer> id){

        List<ProductChange> a = new ArrayList();
        for (Integer s: id) {
            System.out.println(s);
            ProductChange productChange = productChangeService.findByStatus(s);
            a.add(productChange);
        }
        return a;
    }

    @PutMapping("/updateProductChange")
    public List<Product> saveProductReturn(@RequestBody JsonNode products) {
        return billDetailService.saveReturnProduct(products);
    }
    @PutMapping("/updateProductCancel")
    public List<Product> saveProductCancel(@RequestBody JsonNode products) {
        return billDetailService.saveCancelProduct(products);
    }
    @PostMapping("/CreateBillChange")
    public Bill create(@RequestBody JsonNode billData) {
        System.out.println("a");
        return billService.createBillChange(billData);
    }
    @PutMapping("/updateBill/{id}/{ksd}")
    public void updateBill(@PathVariable(value = "id")Integer id,@PathVariable(value = "ksd")String ksd){
        ProductChange productChange = productChangeService.findByStatus(id);
        if (ksd.equals("update")){
        productChange.setStatus(3);
        productChangeService.save(productChange);
        return;
        }
        if (ksd.equals("cancel")){
            productChange.setStatus(4);
            productChangeService.save(productChange);
            return;
        }
    }
}
