package com.poly.be_duan.restcontrollers.admin;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.poly.be_duan.config.VNPayConfig;
import com.poly.be_duan.entities.Account;
import com.poly.be_duan.entities.Bill;
import com.poly.be_duan.service.AccountService;
import com.poly.be_duan.service.BillService;
import com.poly.be_duan.utils.Username;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(value = "/api/vnpay")
public class PaymentVNPRestController {

    Account account = null;

    @Autowired
    private AccountService accountService;

    @Autowired
    private BillService billService;
    @PostMapping("/send")
    public ResponseEntity<JsonNode> PostAPI(HttpServletRequest req,
                                            @RequestParam(name = "vnp_OrderInfo") String vnp_OrderInfo,
                                            @RequestParam(name = "ordertype") String orderType, @RequestParam(name = "amount") String amoutParam,
                                            @RequestParam(name = "bankcode") String bank_code, @RequestParam(name = "language") String locate,
                                            @RequestParam(name="personTake")String personTake,
                                            @RequestParam(name="phoneTake")String phoneTake,
                                            @RequestParam(name="address")String address,
                                            @RequestParam(name="typePayment")Boolean typePayment,@RequestParam(name="moneyShip")String moneyShip)
            throws UnsupportedEncodingException {
        System.out.println(vnp_OrderInfo +"day la id");
        ObjectMapper mapper;
        ObjectNode node = null;
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";

        String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
        String vnp_IpAddr = VNPayConfig.getIpAddress(req);
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;

        int amount = Integer.parseInt(amoutParam) * 100;//
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        if (bank_code != null && !bank_code.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bank_code);
        }
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", orderType);

        if (locate != null && !locate.isEmpty()) {
            vnp_Params.put("vnp_Locale", locate);
        } else {
            vnp_Params.put("vnp_Locale", "vn");
        }
        vnp_Params.put("vnp_ReturnUrl", VNPayConfig.getUrl(amoutParam,personTake,phoneTake,address,false,moneyShip));
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));

        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());

        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        // Add Params of 2.0.1 Version
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
        // Build data to hash and querystring
        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator iterator = fieldNames.iterator();
        while (iterator.hasNext()) {
            String fieldName = (String) iterator.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (iterator.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        System.out.println(hashData.toString());

        mapper = new ObjectMapper();
        node = mapper.createObjectNode();
        node.put("value", VNPayConfig.vnp_PayUrl + "?" + queryUrl);
        return ResponseEntity.ok(node);
    }

    @PostMapping("/add")
    public String addOrder(
            @RequestParam String personTake,
            @RequestParam String phoneTake,
            @RequestParam String address,
            @RequestParam BigDecimal totalMoney,
            @RequestParam int status,
            @RequestParam String description,
            @RequestParam int statusBuy,
            @RequestParam BigDecimal moneyShip,
            @RequestParam boolean typePayment,
            @RequestBody JsonNode cartItems) {

        account = accountService.findByUsername(Username.getUserName());
        Date date = new Date();
        Bill bill = new Bill();
        bill.setCreateDate(date);
        bill.setPersonTake(personTake);
        bill.setPhoneTake(phoneTake);
        bill.setAddress(address);
        bill.setTotalMoney(totalMoney);
        bill.setStatus(status);
        bill.setDescription(description);
        bill.setStatusBuy(statusBuy);
        bill.setMoneyShip(moneyShip);
        bill.setTypePayment(typePayment);
        bill.setAccount(account);
        billService.save(bill);

        return "ok";
    }
}
