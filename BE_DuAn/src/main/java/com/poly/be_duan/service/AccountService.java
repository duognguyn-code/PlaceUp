package com.poly.be_duan.service;

import com.poly.be_duan.dto.*;
import com.poly.be_duan.entities.Account;
import com.poly.be_duan.entities.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface AccountService {
    AccountResponDTO save(AccountRequestDTO entity);

    Account save(Account account);

    public List<Account> getAll();

    List<Account> save(List<Account> entities);

    void deleteById(String id);

    Optional<Account> findById(String id);

    List<AccountResponDTO> findAll();

    Page<AccountResponDTO> findAll(String search, Integer role, Integer status, Pageable pageable);

    AccountResponDTO update(AccountRequestDTO accountDTO, String username);

    Account findByName(String username);

    Account findByUsername(String name);
    Account findByNameForcheckUsername(String name);

    Account findByPhone(String phone);

    String setAddressDefault(Integer id);

    AddressDTO getAddress();

    AccountDTO updateAccountActive(AccountDTO accountDTO);

    Page<Account> getByPage(int pageNumber, int maxRecord, String share);

    AccountResponDTO updateImage(AccountRequestDTO accountRequestDTO);

    Boolean updatePassword(UpdatePasswordDTO updatePasswordDTO);

    Role getRoleByUserName(String userName);



    List<AccountDTO> getAllAccountResponseDTO();

    Account findAccountByUsername(String username);

    public Integer chartAccount(String year);


}
