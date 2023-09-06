package com.poly.be_duan.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "change_product_detail")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChangeProductDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_change_product_detail")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_product")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "id_bill_detail", referencedColumnName = "id_bill_detail")
    private Bill_detail billDetail;

    @ManyToOne
    @JoinColumn(name = "id_change_product")
    private ProductChange changeProduct;
}