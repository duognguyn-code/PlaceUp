package com.poly.be_duan.restcontrollers.admin;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.poly.be_duan.config.beans.SaveProductRequest;
import com.poly.be_duan.entities.*;
import com.poly.be_duan.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Paths;
import java.util.*;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/product")
public class ProductRestController {
    @Autowired
    private ProductService productService;


    @Autowired
    private Cloudinary cloud;
    @Autowired
    private SizeService sizeService;


    @Autowired
    private MaterialService materialService;

    @Autowired
    private DesignService designService;

    @Autowired
    private ColorService colorService;

    @Autowired
    private ImageService imageService;

    @Autowired
    private CategoryService categoryService;

    @GetMapping()
    public ResponseEntity<List<Product>> getAll() {
        System.out.println(productService.findAll());
        try {
            return ResponseEntity.ok(productService.findAll());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }


    @GetMapping("{color}/{design}/{material}/{size}/{product}")
    public ResponseEntity<List<Product>> getByColor(
            @PathVariable("color") String color
            , @PathVariable("design") String design
            , @PathVariable("material") String material
            , @PathVariable("size") String size
    ) {
        try {
            if (color.equalsIgnoreCase(null) && design.equalsIgnoreCase(null) && material.equalsIgnoreCase(null)
                    && size.equalsIgnoreCase(null)) {
                return ResponseEntity.ok(productService.findAll());
            } else {
                return ResponseEntity.ok(productService.getByColor(color, design, material, size));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }


    @GetMapping("/getAllSize")
    public ResponseEntity<List<Size>> getAllSize() {
        try {
            return ResponseEntity.ok(sizeService.getAll());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }

    @PostMapping("/createSize")
    public Size create(@RequestBody Size size) {
        return sizeService.create(size);
    }

    @GetMapping("/getAllMaterial")
    public ResponseEntity<List<Material>> getAllMaterial() {
        try {
            return ResponseEntity.ok(materialService.getAll());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }

    @PostMapping("/createMaterial")
    public Material create(@RequestBody Material material) {
        return materialService.create(material);
    }

    @GetMapping("/getAllColor")
    public ResponseEntity<List<Color>> getAllColor() {
        try {
            return ResponseEntity.ok(colorService.getAll());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/createColor")
    public Color create(@RequestBody Color color) {
        return colorService.create(color);
    }

    @GetMapping("/getAllDesign")
    public ResponseEntity<List<Designs>> getAllDesign() {
        try {
            return ResponseEntity.ok(designService.getAll());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/createDesign")
    public Designs create(@RequestBody Designs designs) {
        return designService.create(designs);
    }


    @GetMapping("/getAllCategory")
    public ResponseEntity<List<Category>> getAllCategory() {
        try {
            return ResponseEntity.ok(categoryService.findAll());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/createCategory")
    public Category create(@RequestBody Category category) {
        return categoryService.save(category);
    }

    private String generationName(SaveProductRequest prd) {
        StringBuilder name = new StringBuilder();
        List<Material> listMate = materialService.getAll();
        List<Designs> Designs = designService.getAll();
        List<Color> listColor = colorService.getAll();
        List<Size> listSize = sizeService.getAll();
        List<Category> listCategory = categoryService.findAll();
        System.out.println(listCategory);

        if (prd.getCategory() != null) {
            for (Category cate : listCategory) {
                if (Objects.equals(prd.getCategory().getIdCategory(), cate.getIdCategory())) {
                    name.append(" ").append(cate.getName());
                }
            }
        }
        if (prd.getMaterial() != null) {
            for (Material mate : listMate) {
                if (Objects.equals(prd.getMaterial().getIdMaterial(), mate.getIdMaterial())) {
                    name.append(mate.getName());
                }
            }
        }

        if (prd.getDesign() != null) {
            for (Designs des : Designs) {
                if (prd.getDesign().getIdDesign() == des.getIdDesign()) {
                    name.append(des.getName());
                }
            }
        }

        if (prd.getColor() != null) {
            for (Color color : listColor) {
                if (prd.getColor().getIdColor() == color.getIdColor()) {
                    name.append(" Màu ").append(color.getName());
                }
            }
        }

        if (prd.getSize() != null) {
            for (Size size : listSize) {
                if (prd.getSize().getIdSize() == size.getIdSize()) {
                    name.append(" Size ").append(size.getName());
                }
            }
        }
        return name.toString();
    }

    public List<Product> findAllPageable(@PathVariable("page") Optional<Integer> page) {
        Pageable pageable = PageRequest.of(page.get(), 5);
        List<Product> products = productService.getAll(pageable).getContent();
        return products;
    }

    @GetMapping(value = "/page/pushedlist")
    public ResponseEntity<Map<String, Object>> findByPublished(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        try {
            List<Product> product = new ArrayList<>();
            Pageable paging = PageRequest.of(page, size);
            Page<Product> pageTuts = productService.getAll(paging);
            product = pageTuts.getContent();
            Map<String, Object> response = new HashMap<>();
            response.put("list", product);
            response.put("currentPage", pageTuts.getNumber());
            response.put("totalItems", pageTuts.getTotalElements());
            response.put("totalPages", pageTuts.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/delete", method = POST)
    public void delete(@RequestParam("id") Integer id) {
        Optional<Product> p = productService.findById(id);
        if (p != null) {
            p.ifPresent(product -> {
                product.setStatus(0);
                productService.save(product);
            });

        } else {
            System.out.println("không tồn tại");
        }
    }

    @RequestMapping(path = "/saveProduct", method = POST, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> save(@ModelAttribute SaveProductRequest saveProductRequest) {
        Random a = new Random();
        int number1 = a.nextInt(999999999);
        Product pd = new Product();
        pd.setName(generationName(saveProductRequest));
        pd.setQuantity(saveProductRequest.getQuantity());
        pd.setColor(saveProductRequest.getColor());
        pd.setMaterial(saveProductRequest.getMaterial());
        pd.setDesign(saveProductRequest.getDesign());
        pd.setSize(saveProductRequest.getSize());
        pd.setCategory(saveProductRequest.getCategory());
        pd.setStatus(saveProductRequest.getStatus());
        pd.setPrice(saveProductRequest.getPrice());
        pd.setBarcode(number1);
        productService.save(pd);
        String data = String.valueOf(number1);

        String path = "C:\\Users\\Windows\\Pictures\\Saved Pictures\\" + generationName(saveProductRequest) + ".jpg";

        try {
            BitMatrix matrix = new MultiFormatWriter()
                    .encode(data, BarcodeFormat.QR_CODE, 500, 500);
            MatrixToImageWriter.writeToPath(matrix, "jpg", Paths.get(path));
        } catch (IOException | WriterException e) {
            throw new RuntimeException(e);
        }
        try {
            System.out.println("Uploaded the files successfully: " + saveProductRequest.getFiles().size());
            for (MultipartFile multipartFile : saveProductRequest.getFiles()) {
                Map r = this.cloud.uploader().upload(multipartFile.getBytes(),
                        ObjectUtils.asMap(
                                "cloud_name", "dcll6yp9s",
                                "api_key", "916219768485447",
                                "api_secret", "zUlI7pdWryWsQ66Lrc7yCZW0Xxg",
                                "secure", true,
                                "folders", "c202a2cae1893315d8bccb24fd1e34b816"
                        ));
                Image i = new Image();
                i.setUrlimage(r.get("secure_url").toString());
                i.setProducts(pd);
                imageService.create(i);
            }
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
        return ResponseEntity.ok("Success");
    }

    @PostMapping("/updateProduct/{id}")
    public void updateProduct(@PathVariable Integer id, @ModelAttribute SaveProductRequest saveProductRequest) {
        Optional<Product> optionalProduct = productService.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setName(generationName(saveProductRequest));
            product.setPrice(saveProductRequest.getPrice());
            product.setCategory(saveProductRequest.getCategory());
            product.setColor(saveProductRequest.getColor());
            product.setDesign(saveProductRequest.getDesign());
            product.setMaterial(saveProductRequest.getMaterial());
            product.setStatus(saveProductRequest.getStatus());
            product.setSize(saveProductRequest.getSize());
            product.setQuantity(saveProductRequest.getQuantity());
            productService.save(product);
            try {
                System.out.println("Uploaded the files successfully: " + saveProductRequest.getFiles().size());
                for (MultipartFile multipartFile : saveProductRequest.getFiles()) {
                    Map r = this.cloud.uploader().upload(multipartFile.getBytes(),
                            ObjectUtils.asMap(
                                    "cloud_name", "dcll6yp9s",
                                    "api_key", "916219768485447",
                                    "api_secret", "zUlI7pdWryWsQ66Lrc7yCZW0Xxg",
                                    "secure", true,
                                    "folders", "c202a2cae1893315d8bccb24fd1e34b816"
                            ));
                    Image i = new Image();
                    i.setUrlimage(r.get("secure_url").toString());
                    i.setProducts(product);
                    imageService.create(i);
                }
            } catch (Exception e) {
                System.err.println(e.getMessage());
            }
        } else {
            throw new RuntimeException("Bản ghi này không tồn tại");
        }
    }

    @PutMapping("/updatePr")
    public Product updateProduct(@RequestBody Product product) {
        System.out.println(productService.save(product));
        return productService.save(product);
    }



        @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Integer id) {
        try {
            Optional<Product> product = productService.findById(id);
            if (product.isPresent()) {
                return ResponseEntity.ok(product.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    @GetMapping("/search/{id}")
    public Product getByIdForImages(@PathVariable Integer id) {
        return productService.findProductForImages(id);
    }

    @GetMapping("search/{name}/{color}/{material}/{size}/{design}/{min}/{max}/{status}/{category}")
    public ResponseEntity<List<Product>> search(@PathVariable(value = "name") String name, @PathVariable(value = "color") String color
            , @PathVariable(value = "material") String material, @PathVariable(value = "size") String size, @PathVariable(value = "design") String design,
                                                @PathVariable(value = "min") String min, @PathVariable(value = "max") String max, @PathVariable(value = "status") String status, @PathVariable(value = "category") String category) {
        BigDecimal mn = null;
        BigDecimal mx = null;
        System.out.println("abc" + "/" + min);
        if (name.equals("undefined")) {
            name = "";
        }
        if (color.equals("undefined")) {
            color = "";
        }
        if (material.equals("undefined")) {
            material = "";
        }
        if (size.equals("undefined")) {
            size = "";
        }
        if (category.equals("undefined")) {
            category = "";
        }
        if (status.equals("undefined")) {
            status = "1";
        }
        if (design.equals("undefined")) {
            design = "";
        }
        if (min.equals("undefined") || min.equals("Min")) {
            mn = new BigDecimal(0);
        } else {
            mn = new BigDecimal(min);
        }
        if (max.equals("undefined") || max.equals("Max")) {
            mx = productService.searchPriceMAX();
        } else {
            mx = new BigDecimal(max);
        }
        int sts = Integer.parseInt(String.valueOf(status));

        System.out.println(productService.search(name, color, material, size, design, mn, mx, sts,category));
        try {
            return ResponseEntity.ok(productService.search(name, color, material, size, design, mn, mx, sts,category));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }
    @PutMapping("/deleteByProduct/{id}")
    public List<Image> deleteByProduct(@PathVariable(value = "id")Integer id){
        List<Image> img = imageService.selectByIdProduct(id);
        for (int i = 0; i < img.size(); i++) {
            imageService.delete(img.get(i).getIdimage());
        }
        return null;
    }

    @GetMapping("/max")
    public BigDecimal getMax() {
        return productService.searchPriceMAX();
    }

    @GetMapping("/searchBill/{idCate}/{idDe}/{idMate}/{idCo}/{idSz}")
    public Optional<Product> getProductBill(@PathVariable("idCate") String idCate, @PathVariable("idDe") String idDe,
                                            @PathVariable("idMate") String idMate, @PathVariable("idCo") String idCo, @PathVariable("idSz") String idSz) {


        int idCT = Integer.parseInt(String.valueOf(idCate));
        int idD = Integer.parseInt(String.valueOf(idDe));
        int idM = Integer.parseInt(String.valueOf(idMate));
        int idC = Integer.parseInt(String.valueOf(idCo));
        int idS = Integer.parseInt(String.valueOf(idSz));
        return productService.getProductBill(idCT, idD, idM, idC, idS);
    }
}
