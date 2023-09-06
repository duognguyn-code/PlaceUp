package com.poly.be_duan.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "designs")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Designs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_designs")
    private Integer idDesign;

    @Column(name = "name", nullable = false)
    private String name;


    @Column(name = "status")
    private Integer status;

    @JsonIgnore
    @OneToMany(mappedBy = "design")
    private List<Product> products;
}
