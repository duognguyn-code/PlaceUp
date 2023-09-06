package com.poly.be_duan.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "sale_detail")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Sale_detail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSaleDetail;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private Integer status;

    @ManyToOne
    @JoinColumn(name = "id_bills")
    private Bill bill;

    @ManyToOne
    @JoinColumn(name = "id_sales")
    private Sale sale;
}
