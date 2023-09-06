package com.poly.be_duan.service;

import com.poly.be_duan.entities.ProductChange;

import java.util.List;

public interface ProductChangeService extends GenericService<ProductChange, Integer> {
    public List<ProductChange> listProductChange();
    public List<ProductChange> findAllProductChange();
    public List<ProductChange> findProductChangeByStatus(Integer status,String phone);
    ProductChange findByStatus(Integer idPrChange);
    public List<ProductChange> findByUsername(String username);
    public List<ProductChange> findByStatusSendEmail(Integer idChange);

    public Integer sumStatus(String number);

}
