package com.poly.be_duan.restcontrollers.admin;

import com.poly.be_duan.service.AccountService;
import com.poly.be_duan.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/chart")
public class ChartsRestController {

    @Autowired
    BillService billService;

    @Autowired
    AccountService accountService;

    @GetMapping("/{year}")
    public List<List> getAll(@PathVariable(value = "year")String year) {
        List a = new ArrayList();
        for (int i = 1; i <=12 ; i++) {
            if (i>9){
                Integer s = billService.chart(year+"-"+i);
                Integer refurn = billService.sumMoneyRefurn(year+"-"+i);
                System.out.println(refurn);
                if (refurn==null) {
                    a.add(s);
                }else {
                Integer total= s-refurn;
                a.add(total);

                }

            }else{
                Integer s = billService.chart(year+"-0"+i);
                Integer refurn = billService.sumMoneyRefurn(year+"-0"+i);
                if (refurn==null){

                    a.add(s);
                }else {
                    Integer total= s-refurn;
                    a.add(total);
                }
            }
        }
        return a;
    }
    @GetMapping("/account/{year}")
    public List<List> getAccount(@PathVariable(value = "year")String year) {
        List a = new ArrayList();
        for (int i = 1; i <=12 ; i++) {
            System.out.println("2023-0"+i);
            if (i>9){
                Integer s = accountService.chartAccount(year+"-"+i);
                a.add(s);
            }else{
                Integer s = accountService.chartAccount(year+"-0"+i);
                a.add(s);
            }
        }
        return a;
    }
    @GetMapping("/billStatus/{year}")
    public List<List> sumBillStatus5(@PathVariable(value = "year")String year) {
        List a = new ArrayList();
        for (int i = 1; i <= 12; i++) {
            System.out.println("2023-0" + i);
            if (i > 9) {
                Integer s = billService.sumBillStatus5(year + "-" + i);
                a.add(s);
            } else {
                Integer s = billService.sumBillStatus5(year + "-0" + i);
                a.add(s);
            }
        }
        return a;
    }
    @GetMapping("/input/{year}")
    public List<List> abc3(@PathVariable(value = "year")String year) {
        List a = new ArrayList();
        Integer refurn = billService.sumMoneyRefurn(year+ "-" );
        if (refurn==null){
            refurn=0;
        }
        Integer s = billService.chart(year+ "-" );
        a.add(s-refurn);
        Integer account = accountService.chartAccount(year+ "-" );
        a.add(account);
        Integer BillCancel = billService.sumBillStatus5(year+ "-" );
        a.add(BillCancel);
        return a;
    }
}
