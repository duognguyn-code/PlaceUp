package com.poly.be_duan.service;

import com.poly.be_duan.entities.Designs;

import java.util.List;
import java.util.Optional;

public interface DesignService {
    public List<Designs> getAll();

    public Designs create(Designs designs);

    public Optional<Designs> getDesignByID(Integer id);

    public Designs update(Designs designs);

    public void delete(Integer id);
    Designs getNameDesigns(String name);
}
