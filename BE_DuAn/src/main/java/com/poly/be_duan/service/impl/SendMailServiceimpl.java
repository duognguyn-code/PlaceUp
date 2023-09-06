package com.poly.be_duan.service.impl;

import com.poly.be_duan.entities.Account;
import com.poly.be_duan.entities.Bill;
import com.poly.be_duan.entities.ProductChange;
import com.poly.be_duan.repositories.AccountRepository;
import com.poly.be_duan.service.ProductChangeService;
import com.poly.be_duan.service.ProductService;
import com.poly.be_duan.service.SendMailService;
import com.poly.be_duan.utils.HashUtil;
import org.hibernate.StaleStateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import java.util.Date;
import javax.mail.Transport;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.InternetAddress;
import java.util.List;
import java.util.Properties;

@Service
public class SendMailServiceimpl implements SendMailService {
    private static final String CONTENT_TYPE_TEXT_HTML = "text/html;charset=\"utf-8\"";
    @Autowired
    ProductChangeService productChangeService;

    @Autowired
    ThymeleafService thymeleafService;
    @Autowired
    AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override
    public void SendEmail(String user, String pass, Integer idchange) {
        try {

            Properties properties = new Properties();
            properties.put("mail.smtp.host", "smtp.gmail.com");
            properties.put("mail.smtp.port", "587");
            properties.put("mail.smtp.auth", "true");
            properties.put("mail.smtp.starttls.enable", "true");
            Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(user,pass);
                }
            });
            Message msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(user, false));

            List<ProductChange> listProductSendMail = productChangeService.findByStatusSendEmail(idchange);
            if(listProductSendMail.isEmpty()){
                System.out.println("null");
            }else {
                for ( ProductChange s: listProductSendMail) {
                    String EMAIL_WELCOME_SUBJECT =
                            "Dear anh chị yêu câu đổi trả hàng của anh chị đã" +
                                    "được xác nhận vui lòng mang máy "+
                                    s.getBillDetail().getProduct().getName() +
                                    " đến cửa hàng địa chỉ tại Ngõ 470 Đ. Láng, Láng Hạ, Đống Đa, Hà Nội";
                    msg.setFrom(new InternetAddress(user));
                    InternetAddress[] toAddresses = {new InternetAddress(s.getEmail())};
                    msg.setRecipients(Message.RecipientType.TO, toAddresses);
                    msg.setSubject("Xác nhận yêu câu đổi trả");
                    msg.setSentDate(new Date());
                    msg.setText(EMAIL_WELCOME_SUBJECT);
                    Transport.send(msg);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            e.getMessage();
        }
    }

    @Override
    public void SendEmailStatus(String user, String pass, Integer status, Integer id) {

    }

    @Override
    public void SendEmailChangePass(String user, String pass, String mail) {
        try {
            Properties properties = new Properties();
            properties.put("mail.smtp.host", "smtp.gmail.com");
            properties.put("mail.smtp.port", "587");
            properties.put("mail.smtp.auth", "true");
            properties.put("mail.smtp.starttls.enable", "true");
            Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(user,pass);
                }
            });
            Message msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(user, false));
            Account acc= accountRepository.findByEmail(mail);

            if(acc.getEmail().equals(mail)){
                acc.setPassword(passwordEncoder.encode("kdi23239dsad"));
                accountRepository.save(acc);
                msg.setFrom(new InternetAddress(user));
                InternetAddress[] toAddresses = {new InternetAddress(acc.getEmail())};
                msg.setRecipients(Message.RecipientType.TO, toAddresses);
                msg.setSubject("PlaceUp - Đổi mật khẩu tài khoản");
                msg.setSentDate(new Date());
                msg.setText("Mật khẩu của bạn là: kdi23239dsad");
                Transport.send(msg);
            }
            else{
                System.out.println("bắn log");
            }
        } catch (Exception e) {
            throw new StaleStateException("Email này không tìm thấy trong database");
        }
    }

    @Override
    public void sendEmailBill(String User, String pass, String mail, String fullName, Bill bill) {
        try {
            Properties properties = new Properties();
            properties.put("mail.smtp.host", "smtp.gmail.com");
            properties.put("mail.smtp.port", "587");
            properties.put("mail.smtp.auth", "true");
            properties.put("mail.smtp.starttls.enable", "true");
            Session session = Session.getInstance(properties, new javax.mail.Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(User,pass);
                }
            });
            Account acc= accountRepository.findByEmail(mail);
            System.out.println(acc);
            Message msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(User, false));
            if(acc.getEmail().equals(mail)){
                msg.setFrom(new InternetAddress(User));
                InternetAddress[] toAddresses = {new InternetAddress(acc.getEmail())};
                msg.setRecipients(Message.RecipientType.TO, toAddresses);
                msg.setSubject("PlaceUp - Thay đổi thông tin đơn hàng mã: "+bill.getId());
                msg.setSentDate(new Date());
                if(bill.getStatus()==1){
                    msg.setContent(thymeleafService.getContent1(fullName),CONTENT_TYPE_TEXT_HTML);
                    Transport.send(msg);
                }
                else if(bill.getStatus()==2){
                    msg.setContent(thymeleafService.getContent2(fullName),CONTENT_TYPE_TEXT_HTML);
                    Transport.send(msg);
                }
                else if(bill.getStatus()==3){
                    msg.setContent(thymeleafService.getContent3(fullName),CONTENT_TYPE_TEXT_HTML);
                    Transport.send(msg);
                }
                else if(bill.getStatus()==4){
                    msg.setContent(thymeleafService.getContent4(fullName),CONTENT_TYPE_TEXT_HTML);
                    Transport.send(msg);
                }else if(bill.getStatus()==5){
                    msg.setContent(thymeleafService.getContent5(fullName),CONTENT_TYPE_TEXT_HTML);
                    Transport.send(msg);
                }
            }
        } catch (Exception e) {
            throw new StaleStateException("Email này không tìm thấy trong database");
        }
    }
}
