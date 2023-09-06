package com.poly.be_duan.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.List;


@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "categories")
@Getter
@Setter
public class   Category {
    @Id
    @Column(name = "id_category")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCategory;


    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private Integer type;


    @Column(name = "status")
    private Integer status;

    @JsonIgnore
    @OneToMany(mappedBy = "category")
    private List<Product> products;
}
