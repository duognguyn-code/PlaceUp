package com.poly.be_duan.service.impl;

import com.cloudinary.Cloudinary;
import com.poly.be_duan.dto.*;
import com.poly.be_duan.entities.Account;
import com.poly.be_duan.entities.Address;
import com.poly.be_duan.entities.Role;
import com.poly.be_duan.repositories.AccountRepository;
import com.poly.be_duan.repositories.AddressRepository;
import com.poly.be_duan.repositories.RoleRepository;
import com.poly.be_duan.service.AccountService;
import com.poly.be_duan.utils.HashUtil;
import com.poly.be_duan.utils.Username;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AccountServiceImpl implements AccountService {
    private final AccountRepository repository;

    @Autowired
    private Cloudinary cloud;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private RoleRepository roleRepository;

    public AccountServiceImpl(AccountRepository repository, AddressRepository addressRepository, ModelMapper modelMapper) {
        this.repository = repository;
        this.addressRepository = addressRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public AccountResponDTO save(AccountRequestDTO entity) {
        return null;
    }

    @Override
    public Account save(Account account) {
        return repository.save(account);
    }

    @Override
    public List<Account> getAll() {
        return repository.findAll();
    }

    @Override
    public List<Account> save(List<Account> entities) {
        return null;
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Account> findById(String id) {
        return Optional.empty();
    }

    @Override
    public List<AccountResponDTO> findAll() {
        return null;
    }

    @Override
    public Page<AccountResponDTO> findAll(String search, Integer role, Integer status, Pageable pageable) {
        return null;
    }

    @Override
    public AccountResponDTO update(AccountRequestDTO accountDTO, String username) {
        return null;
    }

    @Override
    public Account findByName(String username) {
        return repository.findByName(username);
    }

    @Override
    public Account findByUsername(String name) {
        return repository.findByName(name);
    }

    @Override
    public Account findByNameForcheckUsername(String name) {
        return repository.findByNameForcheckUsername(name);
    }

    @Override
    public Account findByPhone(String phone) {
        return repository.findByPhone(phone);
    }

    @Override
    public String setAddressDefault(Integer id) {
        Address address = addressRepository.findById(id).orElse(null);
        Account account = repository.findByName(Username.getUserName());
        account.setAddress_id(address);
        repository.save(account);
        return "OK";
    }

    @Override
    public AddressDTO getAddress() {
        Account account = repository.findByName(Username.getUserName());
        Address address = addressRepository.findById(account.getAddress_id().getIdAddress()).orElse(null);
        AddressDTO addressDTO = modelMapper.map(address, AddressDTO.class);
        System.out.println(addressDTO);
        return addressDTO;
    }

    @Override
    public AccountDTO updateAccountActive(AccountDTO accountDTO) {
        Account accountAcitve = repository.findByName(Username.getUserName());
        accountAcitve.setPhone(accountDTO.getPhone());
        accountAcitve.setEmail(accountDTO.getEmail());
        accountAcitve.setFullName(accountDTO.getFullName());
        accountAcitve.setSex(accountDTO.getGender());
        Account account = repository.save(accountAcitve);
        AccountDTO accountDTO1 = modelMapper.map(account,AccountDTO.class);
        return  accountDTO1;
    }

    @Override
    public Page<Account> getByPage(int pageNumber, int maxRecord, String share) {
        return null;
    }

    @Override
    public AccountResponDTO updateImage(AccountRequestDTO accountRequestDTO) {
        return null;
    }

    @Override
    public Boolean updatePassword(UpdatePasswordDTO updatePasswordDTO) {
        Account account = repository.findByName(Username.getUserName());
        if (HashUtil.verify(updatePasswordDTO.getOldPassword(), account.getPassword())== false){
            return false;
        }else {
            account.setPassword(HashUtil.hash(updatePasswordDTO.getPassword()));
            repository.save(account);
            return true;
        }
    }

    @Override
    public Role getRoleByUserName(String userName) {
        return null;
    }


    @Override
    public List<AccountDTO> getAllAccountResponseDTO() {
        return  null;
    }
    @Override
    public Account findAccountByUsername(String username) {
        return repository.findByUsername(username);
    }

    @Override
    public Integer chartAccount(String year) {
        return repository.chartAccount(year);
    }

}
