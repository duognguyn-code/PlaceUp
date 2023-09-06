package com.poly.be_duan.repositories;

import com.poly.be_duan.entities.Account;
import com.poly.be_duan.entities.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {

    @Query("SELECT p FROM Bill p WHERE p.id = ?1 ")
    public List<Bill> getBill(int id);



    @Query("UPDATE Bill set timeReceive= ?1, moneyShip=?2,statusBuy =?3,status=?4 where (id =?5)")
    public Bill UpdateBill(LocalDateTime date, BigDecimal moneyShip, Integer statusBuy, Integer status, Integer id);

    @Query("SELECT b FROM Bill b WHERE b.phoneTake LIKE %?1% and  b.createDate between ?2 and ?3 and b.status = ?4 ")
    public List<Bill> searchByPhoneAndDateAndStatus(String phone, Date date,Date date1,Integer sts);

    @Query("SELECT b FROM Bill b WHERE b.phoneTake LIKE %?1% and  b.createDate between ?2 and ?3")
    public List<Bill> searchByPhoneAndDate(String phone, Date date,Date date1);

    @Query("SELECT b FROM Bill b WHERE b.phoneTake LIKE %?1% and b.status = ?2 ")
    public List<Bill> searchByPhoneAndStatus(String phone,Integer sts);

//    @Query("SELECT b FROM Bill b WHERE b.phoneTake LIKE %?1% ")
//    public List<Bill> searchByPhone(String phone);

    @Query("update Bill set status= ?1 where id= ?2")
    public Bill UpdateStatus(Integer status, Integer id);

    Optional<Bill> findBillById(Integer id);
//    @Query("SELECT b FROM Bill b WHERE b.createDate between ?1 and  ?2")
//    public List<Bill> searchByDate(Date date,Date date1);
//    @Query("update Bill b set b.totalMoney = ?1 where b.id =?2")
//    public Bill UpdateTotalMoney(BigDecimal money, Integer id);\

    List<Bill> findAllByAccount(Account account);
    @Query(value = "select sum(total_money) as'total money' from Bill \n" +
            "where create_date like  ?1% ",nativeQuery = true)
    public Integer chart(String chart);
    @Query(value = "select sum(money_refund) as'total money' from bill_detail \n" +
            "inner join bill on bill_detail.id_bills = bill.id_bills\n" +
            "where bill.create_date like ?1%",nativeQuery = true)
    public Integer sumMoneyRefurn(String year);

    @Query(value = "select count(id_bills) as'total money'  from Bill \n" +
            " where status like ?1% ",nativeQuery = true)
    public Integer SumStatus(String number);
    @Query(value = "select count(status) as'total ' from Bill \n" +
            "where create_date like ?1% and bill.status='5' ",nativeQuery = true)
    public Integer sumBillStatus5(String date);

    @Query(value = "SELECT MAX(id_bills)\n" +
            "FROM Bill ",nativeQuery = true)
    public Integer MaxIdBill();


}
