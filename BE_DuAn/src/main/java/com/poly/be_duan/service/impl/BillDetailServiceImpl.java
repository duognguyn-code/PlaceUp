package com.poly.be_duan.service.impl;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.poly.be_duan.entities.Bill;
import com.poly.be_duan.entities.Bill_detail;
import com.poly.be_duan.entities.Product;
import com.poly.be_duan.repositories.BillDetailRepository;
import com.poly.be_duan.repositories.ProductRepository;
import com.poly.be_duan.service.BillDetailService;
import com.poly.be_duan.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BillDetailServiceImpl implements BillDetailService {

    @Autowired
    BillDetailRepository billDetailRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ProductService productService;

    @Override
    public List<Bill_detail> getAll() {
        return billDetailRepository.findAll();
    }

    @Override
    public List<Bill_detail> getBill_detail(int id) {
        return billDetailRepository.getBill_detail(id);
    }

    @Override
    public Bill_detail save(Bill_detail entity) {
        return billDetailRepository.save(entity);
    }

    @Override
    public Bill_detail update(Bill_detail bill_detail) {
        return billDetailRepository.save(bill_detail);
    }

    @Override
    public Bill_detail update(Bill_detail bill_detail, Integer id) {
        Optional<Bill_detail> optional = findById(id) ;
        if (optional.isPresent()) {
            return save(bill_detail);
        }
        return null;
    }

    @Override
    public List<Bill_detail> findAllByOrder(Bill bill) {
        return billDetailRepository.findAllByBill(bill);
    }

    @Override
    public List<Bill_detail> findAllByOrderWithTimeReceive(Bill bill) {
        List<Object[]> result = billDetailRepository.findAllBillDetailWithTimeReceiveByBill(bill);

        List<Bill_detail> billDetailsWithTimeReceive = new ArrayList<>();
        for (Object[] objects : result) {
            Bill_detail billDetail = (Bill_detail) objects[0];
            billDetailsWithTimeReceive.add(billDetail);
        }

        return billDetailsWithTimeReceive;
    }

    @Override
    public List<Bill_detail> getBill_detailForMoney(int id) {
        return billDetailRepository.getBill_detailForMoney(id);
    }

    @Override
    public Optional<Bill_detail> findById(Integer id) {
        return billDetailRepository.findById(id) ;
    }

    @Override
    public List<Product> savealldt(JsonNode billData) {
        ObjectMapper mapper = new ObjectMapper();
        TypeReference<List<Product>> type =new  TypeReference<List<Product>>() {};
        List<Product> products = mapper.convertValue(billData.get("productqty"),type).
                stream().peek(d -> d.getId()).collect(Collectors.toList());

        for (int i = 0; i < products.toArray().length; i++) {
                Product prD = productService.getId(products.get(i).getId());
                products.get(i).setQuantity(prD.getQuantity() - products.get(i).getQuantity() );
//                detail.get(i).setStatus(status);
//                productService.save(prD);
//                billDetailService.save(detail.get(i));
        }
        productRepository.saveAll(products);

        return products;
//        return billDetailRepository.saveAll(billData);
    }

    @Override
    public Bill_detail getForProductChange(String id) {
        return billDetailRepository.getForProductChange(id);
    }

    @Override
    public List<Product> saveReturnProduct(JsonNode productChange) {
        ObjectMapper mapper = new ObjectMapper();
        TypeReference<List<Product>> type =new  TypeReference<List<Product>>() {};
        List<Product> products = mapper.convertValue(productChange.get("productReturn"),type).
                stream().peek(d -> d.getId()).collect(Collectors.toList());
        for (int i = 0; i < products.toArray().length; i++) {
            Product prD = productService.getId(products.get(i).getId());
//            products.get(i).setQuantity(prD.getQuantity() + products.get(i).getQuantity());
            prD.setQuantity(prD.getQuantity() + products.get(i).getQuantity());
            productRepository.save(prD);
        }
//        productRepository.saveAll(products);

        return products;
    }
    @Override
    public List<Product> saveCancelProduct(JsonNode productChange) {
        ObjectMapper mapper = new ObjectMapper();
        TypeReference<List<Product>> type =new  TypeReference<List<Product>>() {};
        List<Product> products2 = mapper.convertValue(productChange.get("productCancel"),type).
                stream().peek(d -> d.getId()).collect(Collectors.toList());
        for (int i = 0; i < products2.toArray().length; i++) {
            Product prD = productService.getByName(products2.get(i).getName());
            if (prD!=null){
//                products2.get(i).setId(prD.getId());
//                products2.get(i).setQuantity(prD.getQuantity() + products2.get(i).getQuantity());

                prD.setQuantity(prD.getQuantity() + products2.get(i).getQuantity());
                productRepository.save(prD);
            }else{
                productRepository.save(products2.get(i));
            }


        }
//        productRepository.saveAll(products2);
        return products2;
    }


}
