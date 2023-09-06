package com.poly.be_duan.restcontrollers.admin;

import com.poly.be_duan.entities.Designs;
import com.poly.be_duan.service.DesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/design")
public class DesignRestController {

    @Autowired
    private DesignService designService;
    @GetMapping()
    public List<Designs> getAll() {
        return designService.getAll();
    }

    @PostMapping
    public Designs create(@RequestBody Designs designs) {
        return designService.create(designs);
    }

    @PutMapping("{id}")
    public Designs update(@PathVariable("id") Integer id,@RequestBody Designs designs) {
//        designs.setId_designs(id);
        return designService.update(designs);
    }
    @PutMapping("/delete")
    public Designs updateDelete(@RequestBody Designs designs) {
        designs.setStatus(0);
        return designService.update(designs);
    }
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Integer id) {
        designService.delete(id);
    }
    @GetMapping("{name}")
    public Designs getNameDesigns(@PathVariable("name") String name) {
        return designService.getNameDesigns(name);
    }
}
