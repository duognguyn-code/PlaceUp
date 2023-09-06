package com.poly.be_duan.restcontrollers.admin;

import com.fasterxml.jackson.databind.JsonNode;
import com.poly.be_duan.entities.Account;
import com.poly.be_duan.entities.Bill;
import com.poly.be_duan.entities.Bill_detail;
import com.poly.be_duan.service.*;
import com.poly.be_duan.utils.Username;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/bill")
public class BillRestController {
    @Autowired
    BillService billService;

    @Autowired
    BillDetailService billDetailService;

    @Autowired
    CookieService cookieService;

    @Autowired
    ProductService productService;

    @Autowired
    AccountService accountService;

    @Autowired
    SendMailService sendMailService;

    @GetMapping("")
    public ResponseEntity<List<Bill>> getAll() {
        System.out.println(billService.getAll());
        try {
            return ResponseEntity.ok(billService.getAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }


    }

    @GetMapping("/{id}")
    public List<Bill> getByID(@PathVariable(value = "id") Integer id) {
        System.out.println(billService.getBill(id)+"abc----");
        return billService.getBill(id);

    }

    @GetMapping("/{phone}/{sts}/date")
    public ResponseEntity<List<Bill>> searchBill(@RequestParam("date1") String date1, @RequestParam("date2") String date2, @PathVariable(value = "phone") String phone, @PathVariable(value = "sts") String sts) throws ParseException, Exception {


        LocalDate today = LocalDate.now();
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        if (date1.equals("null")) {
            date1 = "1000/05/03";
        }
        if (date2.equals("null")) {
            String dt =today.format(dateTimeFormatter);
//            date2 = today.format(dateTimeFormatter);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
            Calendar c = Calendar.getInstance();
            c.setTime(sdf.parse(dt));
            c.add(Calendar.DATE, 1);  // number of days to add
            dt = sdf.format(c.getTime());
            date2=dt;
        }
        if (phone.equals(" ")) {
            phone = "0";
        }
        Date dates1 = new Date(date1);
        Date dates2 = new Date(date2);
        if (sts == null | sts.equals("6")) {
            return ResponseEntity.ok(billService.searchByPhoneAndDate(phone, dates1, dates2));
        } else {
            int st = Integer.parseInt(sts);
            return ResponseEntity.ok(billService.searchByPhoneAndDateAndStatus(phone, dates1, dates2, st));
        }
    }


    @PutMapping("/updateStatus/{id}")
    public Bill updateStatus(@PathVariable(value = "id") Integer id, @RequestBody Bill bill) {
        List<Bill_detail> detailStatus = billDetailService.getBill_detailForMoney(id);
        if (detailStatus.isEmpty()){
            Bill billOld = billService.findBillByID(bill.getId()).get();
            if (bill.getStatus() < billOld.getStatus()) {
                return null;
            } else {
                if (billOld.getTypePayment()==true){
                billOld.setStatus(5);
                billOld.setTotalMoney(BigDecimal.valueOf(0));
                sendMailService.sendEmailBill("nguyentungduonglk1@gmail.com", "iscdvtuyqsfpwmbp", billOld.getAccount().getEmail(), billOld.getPersonTake(), billOld);
                System.out.println("gửi mail yahfnh công");
                 billService.updateStatus(billOld);
                }
                if (billOld.getTypePayment()==false){
                    billOld.setStatus(5);
//                    billOld.setTotalMoney(BigDecimal.valueOf(0));
                    sendMailService.sendEmailBill("nguyentungduonglk1@gmail.com", "iscdvtuyqsfpwmbp", billOld.getAccount().getEmail(), billOld.getPersonTake(), billOld);
                    System.out.println("gửi mail yahfnh công");
                     billService.updateStatus(billOld);
                }
            }
        } else {
            Bill billOld = billService.findBillByID(bill.getId()).get();

            if (bill.getStatus() < billOld.getStatus()) {
                return null;
            } else {
                if (bill.getStatus()==5){
                    if (billOld.getTypePayment()==true){
                    billOld.setTotalMoney(BigDecimal.valueOf(0));
                    }
                }
                if (bill.getStatus()==7){
                    billOld.setTotalMoney(BigDecimal.valueOf(0));
                }
                if (bill.getStatus()==4){
                    LocalDateTime today = LocalDateTime.now();
                    DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
                    String date = today.format(dateTimeFormatter);
                    Date date1 = new Date(date);
                    billOld.setTimeReceive(date1);
                }
                if (bill.getStatus()==2){
                    billOld.setUserConfirm(Username.getUserName());
                }
                billOld.setStatus(bill.getStatus());
//                billOld.setTotalMoney(BigDecimal.valueOf(0));
                sendMailService.sendEmailBill("nguyentungduonglk1@gmail.com", "iscdvtuyqsfpwmbp", billOld.getAccount().getEmail(), billOld.getPersonTake(), billOld);
                System.out.println("gửi mail yahfnh công");
                return billService.updateStatus(billOld);

            }
        }return null;
    }

    @PostMapping()
    public Bill create(@RequestBody JsonNode billData) {
        return billService.create(billData);
    }

    @PutMapping("/updateBill")
    public Bill update(@RequestBody Bill bill) {
//        color.setId(id);
        return billService.updateStatus(bill);
    }

    @PutMapping("/updateTotalMoney/{money}/{id}")
    public Bill updateTotalMoney(@PathVariable(value = "money") Integer money, @PathVariable(value = "id") Integer id) {
        BigDecimal mn = new BigDecimal(money);
        Bill bill = billService.findBillByID(id).get();
        if (bill.getTypePayment()==true){
        bill.setTotalMoney(mn);

        }
        if (bill.getTypePayment()==false){
            BigDecimal mon = BigDecimal.valueOf(0);
            List<Bill_detail> billDetails = billDetailService.getBill_detail(id);
            for (int i = 0; i <billDetails.toArray().length ; i++) {
                BigDecimal quantity = BigDecimal.valueOf(billDetails.get(i).getQuantity());
                mon = mon.add(quantity.multiply(billDetails.get(i).getPrice()));
            }
            bill.setTotalMoney(mon);

        }
        return billService.updateStatus(bill);
    }

    @GetMapping("/rest/user/order")
    public List<Bill> getAllByAccount() {
        Account account = accountService.findByUsername(Username.getUserName());
        List<Bill> bills = billService.findAllByAccount(account);
        Comparator comparator = new Comparator<Bill>() {
            @Override
            public int compare(Bill o1, Bill o2) {
                return o2.getId().compareTo(o1.getId());
            }
        };
        Collections.sort(bills, comparator);
        return bills;
    }

    @PostMapping(value = "/rest/user/order/change")
    public Bill billChange(@RequestBody Bill bill) {
        Bill billOld = billService.findById(bill.getId()).get();
        List<Bill_detail> billDetails = billDetailService.findAllByOrder(billOld);
        if (billOld.getStatus() < 2) {
            billOld.setStatus(5);
            billOld.setDescription(bill.getDescription());
            billService.update(billOld, billOld.getId());
            sendMailService.sendEmailBill("nguyentungduonglk1@gmail.com", "iscdvtuyqsfpwmbp", billOld.getAccount().getEmail(), billOld.getPersonTake(), billOld);
            System.out.println("gửi mail yahfnh công");
            return billOld;
        }
        return null;
    }

    @GetMapping("/sumStatus/{number}")
    public Integer sumStatus(@PathVariable(value = "number")String number){
//        int sts = Integer.parseInt(number);
//        System.out.println(billService.sumStatus(number));
        return billService.sumStatus(number);
    }
}
