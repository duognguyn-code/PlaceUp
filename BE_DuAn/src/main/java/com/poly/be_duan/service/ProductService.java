package com.poly.be_duan.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.poly.be_duan.dto.ProductDetailDTO;
import com.poly.be_duan.dto.ProductResponDTO;
import com.poly.be_duan.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductService extends GenericService<Product, Integer> {

  
    List<Product> getByColor(String color, String design, String material, String size);
    public Product update(Product product);

    Page<Product> getAll (Pageable page);
    List<Product> search(String name, String color, String material, String size, String design, BigDecimal min, BigDecimal max, Integer status,String category);
    BigDecimal searchPriceMin();
    BigDecimal searchPriceMAX();
    ProductDetailDTO getDetailProduct(Integer id);

    Product findProductForImages(Integer id);

    Product getdeTailPrd(Integer idDesign, Integer idSize, Integer idColor, Integer idMaterial);
    List<ProductResponDTO> findByCategoryAndStatus(Integer id);

    public List<Product> findAllwithSort(String field, String direction);

    public Optional<Product> getProductBill(Integer idCategory, Integer idDesign, Integer idMaterial, Integer idColor, Integer idSize);
  
    public Optional<Product> getProductByBarCode(Integer barcode);

    public Product getId(Integer id);
    public Product getByName(String name);

    List<Product> findProductByPrices();

    Page<ProductDetailDTO> getByPage(int pageNumber, int maxRecord, JsonNode findProcuctAll);
//    Product findProductForImages(Integer id);


}
