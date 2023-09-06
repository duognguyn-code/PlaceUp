package com.poly.be_duan.service.impl;

import com.poly.be_duan.entities.Category;
import com.poly.be_duan.repositories.CategoryRepository;
import com.poly.be_duan.service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository repository;

    public CategoryServiceImpl(CategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public Category save(Category entity) {
         if(repository.getCategoryByTypeAndName(entity.getType(), entity.getName()).orElse(null) != null){
             return null;
         }else {
             return repository.save(entity);
         }
    }

    @Override
    public List<Category> save(List<Category> entities) {
        return (List<Category>) repository.saveAll(entities);
    }

    @Override
    public void deleteById(Integer id) {
        Category category = repository.findById(id).orElse(null);
        assert category != null;
        category.setStatus(0);
        repository.save(category);
    }

    @Override
    public Optional<Category> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public List<Category> findAll() {
        return (List<Category>) repository.findAll();
    }

    @Override
    public Page<Category> findAll(Pageable pageable) {
        Page<Category> entityPage = repository.findAll(pageable);
        List<Category> entities = entityPage.getContent();
        return new PageImpl<>(entities, pageable, entityPage.getTotalElements());
    }

    @Override
    public Category update(Category entity, Integer id) {
        Category category = repository.findById(id).orElse(null);
        assert category != null;
        category.setName(entity.getName());
        category.setType(entity.getType());
        category.setStatus(entity.getStatus());
        return repository.save(category);
    }

    @Override
    public Category getNameCategory(String name) {
        return repository.getNameCategory(name);
    }

    @Override
    public Category update(Category category) {
        return repository.save(category);
    }
}
