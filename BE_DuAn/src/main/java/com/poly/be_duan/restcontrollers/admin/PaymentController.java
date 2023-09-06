//package com.poly.be_duan.restcontrollers.admin;
//
//
//import com.paypal.api.payments.Links;
//import com.paypal.api.payments.Payment;
//import com.paypal.base.rest.PayPalRESTException;
//import com.poly.be_duan.config.PaypalPaymentIntent;
//import com.poly.be_duan.config.PaypalPaymentMethod;
//import com.poly.be_duan.service.PaypalService;
//import org.apache.log4j.Logger;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.*;
//import com.poly.be_duan.utils.PaypalUtils;
//
//import javax.servlet.http.HttpServletRequest;
//
//@Controller
//@CrossOrigin("*")
//public class PaymentController {
//    public static final String URL_PAYPAL_SUCCESS = "pay/success";
//    public static final String URL_PAYPAL_CANCEL = "pay/cancel";
//
//    private Logger log = Logger.getLogger(PaymentController.class);
//    @Autowired
//    private PaypalService paypalService;
//
//    @PostMapping("/pay")
//    @ResponseBody
//    public String pay(HttpServletRequest request, @RequestBody Double price ){
//        System.out.println("-- Start Paypal");
//        String cancelUrl = PaypalUtils.getBaseURL(request) + "/" + URL_PAYPAL_CANCEL;
//        String successUrl = PaypalUtils.getBaseURL(request) + "/" + URL_PAYPAL_SUCCESS;
//        System.out.println(price);
//        try {
//            Payment payment = paypalService.createPayment(
//                    price,
//                    "EUR",
//                    PaypalPaymentMethod.paypal,
//                    PaypalPaymentIntent.sale,
//                    "payment description",
//                    cancelUrl,
//                    successUrl);
//            for(Links links : payment.getLinks()){
//                if(links.getRel().equals("approval_url")){
//                    return links.getHref();
//                }
//            }
//        } catch (PayPalRESTException e) {
//            log.error(e.getMessage());
//        }
//        return null;
//    }
//    @GetMapping(URL_PAYPAL_CANCEL)
//    public String cancelPay(){
//        return "cancel";
//    }
//    @GetMapping(URL_PAYPAL_SUCCESS)
//    public String successPay(@RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId){
//        try {
//            Payment payment = paypalService.executePayment(paymentId, payerId);
//            if(payment.getState().equals("approved")){
//                return "redirect:/user/cart/buy-cod-success.html";
//            }
//        } catch (PayPalRESTException e) {
//            log.error(e.getMessage());
//        }
//        return "redirect:/user/index#!";
//    }
//}
