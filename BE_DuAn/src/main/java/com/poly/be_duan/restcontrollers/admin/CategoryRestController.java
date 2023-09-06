package com.poly.be_duan.restcontrollers.admin;

import com.poly.be_duan.entities.Category;
import com.poly.be_duan.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryRestController {
    private final CategoryService categoryService;
    @GetMapping()
    public List<Category> getAll() {
        return categoryService.findAll();
    }

    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryService.save(category);
    }

    @PutMapping("")
    public Category update(@RequestBody Category category) {
//        material.setId_materials(id);
        return categoryService.update(category);
    }
    @PutMapping("/delete")
    public Category updateDelete(@RequestBody Category category) {
        category.setStatus(0);
        return categoryService.update(category);
    }
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Integer id) {
        categoryService.deleteById(id);
    }
    @GetMapping("{name}")
    public Category getNameCategory(@PathVariable("name") String name) {
        return categoryService.getNameCategory(name);
    }
}
