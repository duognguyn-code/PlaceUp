package com.poly.be_duan.service.impl;

import com.poly.be_duan.entities.Designs;
import com.poly.be_duan.repositories.DesignRepository;
import com.poly.be_duan.service.DesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DesignServiceImpl implements DesignService {
    @Autowired
    private DesignRepository designRepository;
    @Override
    public List<Designs> getAll() {
        return designRepository.findAll();
    }

    @Override
    public Designs create(Designs designs) {
        return designRepository.save(designs);
    }

    @Override
    public Optional<Designs> getDesignByID(Integer id) {
        return designRepository.findById(id);
    }

    @Override
    public Designs update(Designs designs) {
        return designRepository.save(designs);
    }

    @Override
    public void delete(Integer id) {
        designRepository.deleteById(id);
    }

    @Override
    public Designs getNameDesigns(String name) {
        return designRepository.getNameDesigns(name);
    }
}
