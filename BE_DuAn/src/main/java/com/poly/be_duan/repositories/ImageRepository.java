package com.poly.be_duan.repositories;

import com.poly.be_duan.entities.Image;
import com.poly.be_duan.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Integer> {

    @Query("SELECT i FROM Image i WHERE i.products = :product")
    List<Image> findByProduct(@Param("product") Product product);

    Image findByProductsLikeAndUrlimage(Product product, String urlImage);

    List<Image> findByProductsLike(Product product);

    @Query("select i from Image  i where i.productChange = ?1")
    public List<Image> findImageByPr(Integer id);

//    @Modifying
    @Query("select i from Image  i where i.products.id = ?1")
    List<Image> selectByIdProduct(Integer id);


}
