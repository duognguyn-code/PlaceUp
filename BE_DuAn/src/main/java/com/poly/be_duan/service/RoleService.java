package com.poly.be_duan.service;

import com.poly.be_duan.entities.Color;
import com.poly.be_duan.entities.Role;

import java.util.List;

public interface RoleService {
    public List<Role> getAll();

    public Role create(Role role);

    public Role getRoleByID(Long id);

    public Role update(Role role);

    public void delete(Long id);
}
