package com.poly.be_duan.repositories;

import com.poly.be_duan.entities.Bill;
import com.poly.be_duan.entities.Bill_detail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillDetailRepository extends JpaRepository<Bill_detail,Integer> {

    @Query("SELECT p FROM Bill_detail p WHERE p.bill.id = ?1 ")
    public List<Bill_detail> getBill_detail(int id);

    @Query("SELECT p FROM Bill_detail p WHERE p.bill.id = ?1 and (p.status =1 or p.status=2)  ")
    public List<Bill_detail> getBill_detailForMoney(int id);

    @Query(value = "select * from bill_detail\n" +
            "inner join bill on bill.id_bills = bill_detail.id_bills\n" +
            "inner join change_product on change_product.id_bill_detail = bill_detail.id_bill_detail\n" +
            "inner join images on images.id_product_change = change_product.id_change_product\n" +
            "where id_change_product = ?1 ", nativeQuery = true)
    public Bill_detail getForProductChange(String id);

    List<Bill_detail> findAllByBill(Bill bill);

    @Query("SELECT bd, b.timeReceive FROM Bill_detail bd JOIN bd.bill b WHERE bd.bill = ?1")
    List<Object[]> findAllBillDetailWithTimeReceiveByBill(Bill bill);

    @Query(value = "select * from bill_detail\n" +
            "inner join bill on bill.id_bills = bill_detail.id_bills\n" +
            "where bill_detail.status like '2' and bill.id_bills  like ?1 ", nativeQuery = true)
    public List<Bill_detail> findByMoneyShipOnBillDetail(Integer id);
    @Query(value = "select * from bill_detail\n" +
            "inner join bill on bill.id_bills = bill_detail.id_bills\n" +
            "where bill_detail.status like '1' and bill.id_bills  like ?1 ", nativeQuery = true)
    public List<Bill_detail> findByMoneyShipOnBillDetail1(Integer id);
}