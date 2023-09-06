package com.poly.be_duan.dto;

import com.poly.be_duan.entities.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDTO {
    private Integer id;
    private String name;
    private int quantity;
    private BigDecimal priceMin;
    private BigDecimal priceMax;
    private List<Material> materials;
    private List<Designs> designs;
    private List<Size> sizes;
    private List<Color> colors;
    private List<String> images;
}
