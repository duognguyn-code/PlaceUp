package com.poly.be_duan.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO {
    private Integer idAddress;
    private String addressDetail;
    private String personTake;
    private String phoneTake;
    private String addressTake;
    private String provinceId;
    private String districtId;
    private String wardId;
    private String province;
    private String district;
    private String ward;
}
