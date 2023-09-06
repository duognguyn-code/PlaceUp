package com.poly.be_duan.dto;

import com.poly.be_duan.entities.Bill_detail;
import com.poly.be_duan.entities.Product;
import com.poly.be_duan.entities.ProductChange;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangeProductDetailDTO {
    private Integer idChangeDetail;
    private Product product;
    private Bill_detail bill_detail;
    private ProductChange productChange;
}
