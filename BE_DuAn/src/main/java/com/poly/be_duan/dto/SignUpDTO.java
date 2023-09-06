package com.poly.be_duan.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SignUpDTO {
    private String username;
    private String fullName;
    private String phone;
    private String password;
    private Date date;
    private Integer sex;
    private String email;
    private Set<String> role;
}
