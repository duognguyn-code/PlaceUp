package com.poly.be_duan.repositories;

import com.poly.be_duan.entities.Designs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DesignRepository extends JpaRepository<Designs, Integer> {
    @Query(" SELECT s FROM Designs s WHERE s.name like %?1% ")
    Designs getNameDesigns(String name);
}
