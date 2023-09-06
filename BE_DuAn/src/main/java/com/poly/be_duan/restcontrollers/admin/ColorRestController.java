package com.poly.be_duan.restcontrollers.admin;

import com.poly.be_duan.entities.Color;
import com.poly.be_duan.service.ColorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/color")
public class ColorRestController {
    @Autowired
    private ColorService colorService;

    @GetMapping()
    public ResponseEntity<List<Color>> getAll() {
        try {
            return ResponseEntity.ok(colorService.getAll());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }
    @PostMapping
    public Color create( @RequestBody Color color) {
        return colorService.create(color);
    }
    @PutMapping("{id}")
    public Color update(@PathVariable("id") Integer id,@RequestBody Color color) {
//        color.setId(id);
        return colorService.update(color);
    }
    @PutMapping("/delete")
    public Color updateDelete(@RequestBody Color color) {
        color.setStatus(0);
        return colorService.update(color);
    }
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Integer id) {
        colorService.delete(id);
    }
    @GetMapping("{name}")
    public Color getNameColor(@PathVariable("name") String name) {
        return colorService.getNameColor(name);
    }
}
