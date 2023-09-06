package com.poly.be_duan.service;

import com.poly.be_duan.entities.Category;

public interface CategoryService  extends GenericService<Category, Integer>{
    Category getNameCategory(String name);
    public Category update(Category category);

}
