package com.poly.be_duan.restcontrollers.admin;

import com.poly.be_duan.entities.Size;
import com.poly.be_duan.service.SizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/size")
public class SizeRestController {

    @Autowired
    private SizeService sizeService;

    @GetMapping()
    public List<Size> getAll(){
        return sizeService.getAll();
    }

    @PostMapping
    public Size create(@RequestBody Size size) {
        return sizeService.create(size);
    }

    @PutMapping("{id}")
    public Size update(@PathVariable("id") Integer id,@RequestBody Size size) {
        return sizeService.update(size);
    }
    @PutMapping("/delete")
    public Size updateDelete(@RequestBody Size size) {
        size.setStatus(0);
        return sizeService.update(size);
    }
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Integer id) {
        sizeService.delete(id);
    }

    @GetMapping("{name}")
    public Size getNameSize(@PathVariable("name") String name) {
        return sizeService.getNameSize(name);
    }
}
