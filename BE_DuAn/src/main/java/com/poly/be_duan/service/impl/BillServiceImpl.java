package com.poly.be_duan.service.impl;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.poly.be_duan.entities.Account;
import com.poly.be_duan.entities.Bill;
import com.poly.be_duan.entities.Bill_detail;
import com.poly.be_duan.repositories.BillDetailRepository;
import com.poly.be_duan.repositories.BillRepository;
import com.poly.be_duan.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BillServiceImpl implements BillService {

    @Autowired
    BillRepository billRepository;

    @Autowired
    BillDetailRepository billDetailRepository;

    @Override
    public Bill save(Bill entity) {
        return billRepository.save(entity);
    }

    @Override
    public List<Bill> getAll() {
        return billRepository.findAll();
    }

    @Override
    public Optional<Bill> findById(Integer id) {
        return billRepository.findById(id);
    }

    @Override
    public List<Bill> getBill(Integer id) {
        return billRepository.getBill(id);
    }

    @Override
    public Bill update(Bill bill, Integer id) {
        Optional<Bill> optional = findById(id) ;
        if (optional.isPresent()) {
            return save(bill);
        }
        return null;
    }

    @Override
    public Bill update(Bill bill) {
        return billRepository.save(bill);
    }

    @Override
    public List<Bill> searchByPhoneAndDateAndStatus(String phone, Date date,Date date1, Integer sts) {
        return billRepository.searchByPhoneAndDateAndStatus(phone,date,date1,sts);
    }

    @Override
    public List<Bill> searchByPhoneAndDate(String phone, Date date,Date date1) {
        return billRepository.searchByPhoneAndDate(phone,date,date1);
    }

    @Override
    public List<Bill> searchByPhoneAndStatus(String phone, Integer sts) {
        return billRepository.searchByPhoneAndStatus(phone,sts);
    }

    @Override
    public Integer sumBillStatus5(String date) {
        return billRepository.sumBillStatus5(date);
    }

    @Override
    public Bill updateStatus(Bill bill) {
        return billRepository.save(bill);
    }

    @Override
    public Optional<Bill> findBillByID(Integer id) {
        return billRepository.findBillById(id);
    }

    @Override
    public Bill create(JsonNode billData) {
        ObjectMapper mapper = new ObjectMapper();
        Bill bill  = mapper.convertValue(billData,Bill.class);
//        LocalDate today = LocalDate.now();
//        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
//        String date = today.format(dateTimeFormatter);
//        Date date1 = new Date(date);
//        bill.setCreateDate(date1);
        billRepository.save(bill);
        TypeReference<List<Bill_detail>> type =new  TypeReference<List<Bill_detail>>() {};
        List<Bill_detail> details = mapper.convertValue(billData.get("billDetails"),type).
                stream().peek(d -> d.setBill(bill)).collect(Collectors.toList());
        billDetailRepository.saveAll(details);
        return bill;
    }
    @Override
    public Bill createBillChange(JsonNode billData) {
        ObjectMapper mapper = new ObjectMapper();
        Bill bill  = mapper.convertValue(billData,Bill.class);
        billRepository.save(bill);
        TypeReference<List<Bill_detail>> type =new  TypeReference<List<Bill_detail>>() {};
        List<Bill_detail> details = mapper.convertValue(billData.get("billDetails"),type).
                stream().peek(d -> d.setBill(bill)).collect(Collectors.toList());
        billDetailRepository.saveAll(details);
        return bill;
    }

    @Override
    public List<Bill> findAllByAccount(Account account) {
        return billRepository.findAllByAccount(account);
    }

    @Override
    public Integer chart(String date) {
        return billRepository.chart(date);
    }

    @Override
    public Integer sumStatus(String number) {
        return billRepository.SumStatus(number);
    }

    @Override
    public Integer MaxIdBill() {
        return billRepository.MaxIdBill();
    }

    @Override
    public Integer sumMoneyRefurn(String year) {
        return billRepository.sumMoneyRefurn(year);
    }

    @Override
    public List<Bill_detail> findByMoneyShipOnBillDetail(Integer id) {
        return billDetailRepository.findByMoneyShipOnBillDetail(id);
    }
    @Override
    public List<Bill_detail> findByMoneyShipOnBillDetail1(Integer id) {
        return billDetailRepository.findByMoneyShipOnBillDetail1(id);
    }
}
