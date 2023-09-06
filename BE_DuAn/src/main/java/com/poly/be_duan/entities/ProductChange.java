package com.poly.be_duan.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "change_product")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductChange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_change_product")
    private Integer id;

    @Column(name = "date_change")
    private Date dateChange;

    @Column(name = "description")
    private String description;

    @JoinColumn(name = "username")
    @ManyToOne
    private Account account;

    @Column(name = "email")
    private String email;

    @Column(name = "username_update")
    private String usernameUpdate;

    @Column(name = "phone")
    private String phone;

    @ManyToOne
    @JoinColumn(name = "id_bill_detail", referencedColumnName = "id_bill_detail")
    private Bill_detail billDetail;

    @Column(name = "quantity_product_change")
    private int quantityProductChange;

    @Column(name = "status")
    private int  status;


    @JsonIgnore
    @OneToMany(mappedBy = "changeProduct")
    private List<ChangeProductDetail> changeProductDetails;


//    @JsonIgnore
    @OneToMany(mappedBy = "productChange")
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonManagedReference(value = "productChange")
    private List<Image> images;
    @JsonManagedReference
    public List<Image> getImages(){
        return images;
    }

    @Transient
    private List<MultipartFile> files;
}
