package com.poly.be_duan.repositories;

import com.poly.be_duan.entities.ProductChange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductChangeRepository extends JpaRepository<ProductChange, Integer> {

    @Query(value = "select * from change_product left join change_product_detail on change_product.id_change_product = change_product_detail.id_change_product",nativeQuery = true)
    public List<ProductChange> findProductChange();

    @Query(value = "select * from change_product left join change_product_detail \n" +
            "on change_product.id_change_product = change_product_detail.id_change_product\n" +
            "where change_product.status =?1 and change_product.phone like %?2%",nativeQuery = true)
    public List<ProductChange> findProductChangeByStatus(Integer status,String phone);
    @Query("select pr from ProductChange pr order by  pr.id")
    public List<ProductChange> findAllProductChange();

    @Query("select pr from ProductChange pr where  pr.id = ?1")
    ProductChange findByStatus(Integer idPrChange);

    @Query("select pr from ProductChange pr where pr.account = ?1")
    public List<ProductChange> findByAccount(String username);

    @Query("select pr from ProductChange pr where pr.status = 2 and pr.id = ?1")
    public List<ProductChange> findByStatusSendEmail(Integer idChange);

    @Query(value = " select count(id_change_product) as 'total ' from change_product\n" +
            " where status like ?1% ",nativeQuery = true)
    public Integer SumStatus(String number);
}
