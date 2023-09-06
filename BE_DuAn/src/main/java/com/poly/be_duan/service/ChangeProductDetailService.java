package com.poly.be_duan.service;

import com.poly.be_duan.entities.ChangeProductDetail;
import com.poly.be_duan.entities.ProductChange;

public interface ChangeProductDetailService extends GenericService<ChangeProductDetail, Integer>{
    public void createChangeDetails(Integer id);

    public ChangeProductDetail findPrChangeDetails(ProductChange idPrChange);
}
