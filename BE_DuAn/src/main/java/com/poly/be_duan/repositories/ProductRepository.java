package com.poly.be_duan.repositories;

import com.poly.be_duan.entities.Category;
import com.poly.be_duan.entities.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends PagingAndSortingRepository<Product, Integer> {
//    public Product findProductById_products(Integer id_products);
    List<Product> findByCategoryAndStatus(Category category, int status);
    @Query("SELECT p FROM Product p WHERE (p.color.name LIKE %?1% " +
            "or p.design.name LIKE %?2% o" +
            "r p.material.name LIKE %?3% " +
            "or p.size.name LIKE %?4% )")
    public List<Product> getByColor(String color, String design, String material, String size);

    @Query("SELECT p FROM Product p WHERE p.name LIKE %?1% " +
            "and p.color.name LIKE %?2% " +
            "and p.material.name LIKE %?3% " +
            "and p.size.name LIKE %?4% " +
            "and p.design.name LIKE %?5%"+
            "and p.price between ?6 and ?7 "+
            "and p.status = ?8" +
            " and p.category.name LIKE %?9%"

    )
    public List<Product> search(String name, String color, String material, String size, String design, BigDecimal min, BigDecimal max, Integer status, String category);
    @Query("select MIN(p.price) FROM Product p")
    public BigDecimal searchMin();
    @Query("select MAX(p.price) FROM Product p")
    public BigDecimal searchMax();
    @Query(value = "select distinct id_color from products where id_category=?1 and status=1",nativeQuery = true)
    List<Integer> getlistDetailProductColor(Integer id);
    @Query(value = "select distinct id_size from products where id_category = ?1 and status=1",nativeQuery = true)
    List<Integer> getlistDetailProductSize(Integer id);
    @Query(value = "select distinct id_design from products where id_category =?1 and status=1",nativeQuery = true)
    List<Integer> getlistDetailProductDesign(Integer id);
    @Query(value = "select distinct id_material from products where id_category =?1 and status=1",nativeQuery = true)
    List<Integer> getlistDetailProductMaterial(Integer id);
    @Query(value = "select * from products where id_design =?1 and id_size  =?2 and id_color =?3 and id_material =?4 and status=1 limit 1",nativeQuery = true)
    Product getDetailPrd(Integer idDesign, Integer idSize, Integer idColor, Integer idMaterial);
    @Query(value = "SELECT products.id_products  FROM products where id_category = ?1 and status = 1", nativeQuery = true)
    List<Integer> getIdimage(Integer id);
    @Query(value = "select url_image from images where id_products =?1 limit 1",nativeQuery = true)
    String getImg(Integer id);
    @Query(value = "select distinct id_category from products where status = 1",nativeQuery = true)
    List<Integer> getlistDetailProductCategory();
    @Query(value = "select MIN(price) from products where id_category = ?1 and status=1 order by price",nativeQuery = true)
    BigDecimal getMinPrice(Integer id);

    @Query(value = "select MAX(price) from products where id_category = ?1 and status=1 order by price",nativeQuery = true)
    BigDecimal getMaxPrice(Integer id);
    @Query(value = "SELECT * FROM products p where p.id_category = :id and p.status = :status", nativeQuery = true)
    List<Product> getProductByCategoryIdAndStatus(Integer id, Integer status);


    @Query(" SELECT p FROM Product p WHERE p.category.idCategory = ?1 and p.design.idDesign =?2 and p.material.idMaterial=?3 and p.color.idColor=?4 and p.size.idSize=?5")

    Optional<Product> getProductBill(Integer idCategory, Integer idDesign, Integer idMaterial, Integer idColor, Integer idSize);

    @Query(" SELECT p FROM Product p WHERE p.barcode = ?1 ")
    Optional<Product> getProductByBarCode(Integer barcode);

    @Query(" SELECT p FROM Product p WHERE p.id = ?1 ")
    Product getID(Integer id);

    @Query(" SELECT p FROM Product p WHERE p.name = ?1 and p.status = 2 ")
    Product getByName(String name);

    @Query("SELECT p FROM Product p where p.price between 100000 and 500000")
    List<Product> findProductByPrices();

    @Query(value = "select * from products where status = 1",nativeQuery = true)
    List<Product> findProduct();

    @Query(value = "select * from products\n" +
            "inner join images\n" +
            "on products.id_products = images.id_products\n" +
            "where products.id_products = ?1 ",nativeQuery = true)
    Product findProductForImages(Integer id);
}
