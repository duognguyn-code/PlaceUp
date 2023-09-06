package com.poly.be_duan.repositories;

import com.poly.be_duan.entities.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Integer> {

    @Query(value = "select * from author\n" +
            "inner join account\n" +
            "on author.username = account.username\n" +
            "inner join role\n" +
            "on role.id_role = author.id_role",nativeQuery = true)
    public List<Author> findAll();


    @Query(value = "select * from author\n" +
            "inner join account\n" +
            "on author.username = account.username\n" +
            "inner join role\n" +
            "on role.id_role = author.id_role\n" +
            "where account.username like %?1% \n" +
            "and account.phone like %?2% \n" +
            "and account.full_name like %?3% \n" +
            "and account.email like %?4%  \n" +
            "and account.status like %?5%  \n" +
            "and role.name like %?6%",nativeQuery = true)
    public List<Author> searchAllAccount(String username, String phone, String fullName, String email, Integer status, String roldeName);
    @Query(value = "select * from author\n" +
            "inner join account\n" +
            "on author.username = account.username\n" +
            "inner join role\n" +
            "on role.id_role = author.id_role\n" +
            "where account.username like %?1% \n" +
            "and account.phone like %?2% \n" +
            "and account.full_name like %?3% \n" +
            "and account.email like %?4%  \n" +
            "and role.name like %?5%",nativeQuery = true)
    public List<Author> searchAccountNoStatus(String username, String phone, String fullName, String email, String roldeName);
    @Query(value = "select * from author\n" +
            "inner join account\n" +
            "on author.username = account.username\n" +
            "inner join role\n" +
            "on role.id_role = author.id_role\n" +
            "where \n" +
            " account.phone like %?1% \n" +
            "and account.full_name like %?2% \n" +
            "and account.email like %?3%  \n" +
            "and account.status like %?4%  \n" +
            "and role.name like %?5%",nativeQuery = true)
    public List<Author> searchAccountNoUsername(String phone, String fullName, String email, Integer status, String roldeName);
    @Query(value = "select * from author\n" +
            "inner join account\n" +
            "on author.username = account.username\n" +
            "inner join role\n" +
            "on role.id_role = author.id_role\n" +
            "where \n" +
            " account.phone like %?1% \n" +
            "and account.full_name like %?2% \n" +
            "and account.email like %?3%  \n" +
            "and role.name like %?4%",nativeQuery = true)
    public List<Author> searchAccountNoUsernameNoStatus(String phone, String fullName, String email, String roldeName);

    @Query(value = "select * from author\n" +
            "inner join account\n" +
            "on author.username = account.username\n" +
            "inner join role\n" +
            "on role.id_role = author.id_role\n" +
            "where account.username like ?1 ",nativeQuery = true)
    public Author searchAccountByUsername(String username);




    @Query("SELECT a FROM Author a WHERE a.account.username LIKE :username")
    public Author findByName(@Param("username") String username);
}
