package com.poly.be_duan.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "bill_detail")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Bill_detail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bill_detail")
    private Integer id;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "price")
    private BigDecimal price;

//null
    @Column(name = "date_return")
    private Date dateReturn;

//null
    @Column(name = "money_refund")
    private BigDecimal moneyRefund;

    @Column(name = "description")
    private String description;

    @Column(name ="status")
    private Integer status;

    @ManyToOne
    @JoinColumn(name = "id_bills")
    private Bill bill;

    @ManyToOne
    @JoinColumn(name = "id_products")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "previous_bill_detail_id")
    private Bill_detail previousBillDetail;

    @JsonIgnore
    @OneToMany(mappedBy = "billDetail")
    private List<ProductChange> productChanges;

}
