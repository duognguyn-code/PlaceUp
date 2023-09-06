package com.poly.be_duan.service.impl;

import com.poly.be_duan.entities.Size;
import com.poly.be_duan.repositories.SizeRepository;
import com.poly.be_duan.service.SizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SizeServiceImpl implements SizeService {

    @Autowired
    private SizeRepository sizeRepository;
    @Override
    public List<Size> getAll() {
        return sizeRepository.findAll();
    }

    @Override
    public Size create(Size size) {
        return sizeRepository.save(size);
    }

    @Override
    public Optional<Size> getSizeByID(Integer id) {
        return sizeRepository.findById(id);
    }

    @Override
    public Size update(Size size) {
        return sizeRepository.save(size);
    }

    @Override
    public void delete(Integer id) {
        sizeRepository.deleteById(id);
    }

    @Override
    public Size getNameSize(String name) {
        return sizeRepository.getNameSize(name);
    }
}
