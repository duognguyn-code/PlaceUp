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
import javax.validation.constraints.Min;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "products")
//@Indexed
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Product  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_products", unique = true, nullable = false, precision = 10)
    private Integer id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;


    @Min(value = 0, message = "{Product.quantity.Min")
    @Column(name = "quantity", nullable = false)
    private int quantity;
    @Column(name = "status", nullable = false, precision = 10)
    private int status;

    @OneToMany(mappedBy = "products")
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonManagedReference(value = "product")
    private List<Image> images;

    @JsonManagedReference
    public List<Image> getImages(){
        return images;
    }


    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "barcode", nullable = false)
    private int barcode;

    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private List<Bill_detail> billDetails;

    @ManyToOne
    @JoinColumn(name = "id_category")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "id_size", referencedColumnName = "id_size")
    private Size size;

    @ManyToOne
    @JoinColumn(name = "id_color", referencedColumnName = "id_colors")
    private Color color;

    @ManyToOne
    @JoinColumn(name = "id_design", referencedColumnName = "id_designs")
    private Designs design;

    @ManyToOne
    @JoinColumn(name = "id_material", referencedColumnName = "id_materials")
    private Material material;

    @Transient
    private List<MultipartFile> files;

    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private List<ChangeProductDetail> changeDetails;
    public Product(Integer id, String name, int status, List<Image> images, BigDecimal price, Category category, Size size, Color color, Designs design, Material material, List<MultipartFile> files) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.images = images;
        this.price = price;
        this.category = category;
        this.size = size;
        this.color = color;
        this.design = design;
        this.material = material;
        this.files = files;
    }
}
