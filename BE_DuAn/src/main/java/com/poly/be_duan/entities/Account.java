package com.poly.be_duan.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "account")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Account {
    @Id
    @Column(name = "username", length = 250)
    @NotBlank(message = "Tên tài khoản không được trống")
    @Size(min = 3, max = 250, message = "Tên tài khoản từ 3-250 ký tự")
    private String username;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String password;

//    @JsonIgnoreProperties
    @JsonIgnore
    @OneToMany(mappedBy = "account", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    private List<Author> authorList;

    @Column(nullable = false)
    private String phone;

    @Column()
    private Date date;

    @Column()
    private Boolean sex;

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<Address> addresses;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "address_id", referencedColumnName = "id_address")
    private Address address_id;

    @Column(nullable = false)
    private String email;

    @Column(columnDefinition = "INT DEFAULT 1")
    private Integer status;

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<ProductChange> productChanges;

}
