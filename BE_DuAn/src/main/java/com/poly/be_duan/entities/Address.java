package com.poly.be_duan.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "address")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    @Id
    @Column(name = "id_address")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAddress;

    @Column(name = "address_detail")
    private String addressDetail;

    @Column(name = "person_take")
    private String personTake;

    @Column(name = "phone_take")
    private String phoneTake;

    @Column(name = "address_take")
    private String addressTake;

    @Column(name = "id_province")
    private String provinceId;

    @Column(name = "id_district")
    private String districtId;

    @Column(name = "id_ward")
    private String wardId;

    @Column(name = "province")
    private String province;

    @Column(name = "district")
    private String district;

    @Column(name = "ward")
    private String ward;

    @JsonIgnore
    @OneToOne(mappedBy = "address_id")
    private Account account_address;


    @ManyToOne
    @JoinColumn(name = "username")
    private Account account;
}
