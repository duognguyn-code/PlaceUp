package com.poly.be_duan.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.poly.be_duan.entities.Bill;
import com.poly.be_duan.entities.Bill_detail;
import com.poly.be_duan.entities.Product;

import java.util.List;
import java.util.Optional;

public interface BillDetailService {

    List<Bill_detail> getAll();

    List<Bill_detail> getBill_detail(int id);

    Bill_detail save(Bill_detail entity);
    public Bill_detail update(Bill_detail bill_detail);

    public Bill_detail update(Bill_detail bill_detail, Integer id);


    List<Bill_detail> findAllByOrder(Bill bill);
    List<Bill_detail> findAllByOrderWithTimeReceive(Bill bill);

    List<Bill_detail> getBill_detailForMoney(int id);

    Optional<Bill_detail> findById(Integer id);
    public List<Product> savealldt(JsonNode billData);

    public Bill_detail getForProductChange(String id);
    public List<Product> saveReturnProduct(JsonNode productChange);
    public List<Product> saveCancelProduct(JsonNode productChange);
}
