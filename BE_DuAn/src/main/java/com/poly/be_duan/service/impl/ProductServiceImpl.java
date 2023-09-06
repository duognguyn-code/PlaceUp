package com.poly.be_duan.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.poly.be_duan.dto.ProductDetailDTO;
import com.poly.be_duan.dto.ProductResponDTO;
import com.poly.be_duan.entities.*;
import com.poly.be_duan.repositories.*;
import com.poly.be_duan.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    @Autowired
    private DesignRepository designRepository;

    @Autowired
    private ColorRepository colorRepository;

    @Autowired
    private SizeRepository sizeRepository;

    @Autowired
    private MaterialRepository materialRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productDetailRepository1) {
        this.productRepository = productDetailRepository1;
    }

    public List<Product> getByColor(String color, String design, String material, String size) {
        return (List<Product>) productRepository.getByColor(color, design, material, size);
    }

    @Override
    public Product update(Product product) {
        return productRepository.save(product);
    }


    @Override
    public Page<Product> getAll(Pageable page) {
        return productRepository.findAll(page);
    }

    @Override
    public Product save(Product entity) {
        return productRepository.save(entity);
    }

    @Override
    public List<Product> save(List<Product> entities) {
        return (List<Product>) productRepository.saveAll(entities);
    }

    @Override
    public void deleteById(Integer id) {

        productRepository.deleteById(id);
    }


    @Override
    public Optional<Product> findById(Integer id) {
        return productRepository.findById(id);
    }

    @Override
    public List<Product> findAll() {
        return (List<Product>) productRepository.findAll();
    }

    @Override
    public Page<Product> findAll(Pageable pageable) {
        Page<Product> entityPage = productRepository.findAll(pageable);
        List<Product> entities = entityPage.getContent();
        return new PageImpl<>(entities, pageable, entityPage.getTotalElements());
    }

    @Override
    public Product update(Product entity, Integer id) {
        Optional<Product> optional = findById(id);
        if (optional.isPresent()) {
            return save(entity);
        }
        return null;
    }

    @Override
    public List<Product> search(String name, String color, String material, String size, String design, BigDecimal min, BigDecimal max, Integer status,String category) {
        return productRepository.search(name, color, material, size, design, min, max, status,category);
    }

    @Override
    public BigDecimal searchPriceMin() {
        return productRepository.searchMin();
    }

    @Override
    public BigDecimal searchPriceMAX() {
        return productRepository.searchMax();
    }

    @Override
    public ProductDetailDTO getDetailProduct(Integer id) {
        List<Color> listColor = new ArrayList<>();
        List<Material> listMaterial = new ArrayList<>();
        List<Size> listSize = new ArrayList<>();
        List<Designs> listDesign = new ArrayList<>();
        List<Integer> listImage = new ArrayList<>();
        List<String> listimage = new ArrayList<>();
        for (int x : productRepository.getlistDetailProductColor(id)
        ) {
            listColor.add(colorRepository.findById(x).get());
        }
        for (int x : productRepository.getlistDetailProductDesign(id)
        ) {
            listDesign.add(designRepository.findById(x).get());
        }
        for (int x : productRepository.getlistDetailProductMaterial(id)
        ) {
            listMaterial.add(materialRepository.findById(x).get());
        }
        for (int x : productRepository.getlistDetailProductSize(id)
        ) {
            listSize.add(sizeRepository.findById(x).get());
        }
        for (int x : productRepository.getIdimage(id)
        ) {
            listImage.add(x);
        }
        if (listImage.size() != 0) {
            for (int i = 0; i < listImage.size(); i++) {
                if (productRepository.getImg(listImage.get(i)) != null) {
                    listimage.add(productRepository.getImg(listImage.get(i)));
                }
            }
        }
        ProductDetailDTO detailproduct = new ProductDetailDTO();
        detailproduct.setId(id);
        detailproduct.setName(categoryRepository.findById(id).get().getName());
        detailproduct.setColors(listColor);
        detailproduct.setDesigns(listDesign);
        detailproduct.setMaterials(listMaterial);
        detailproduct.setSizes(listSize);
        detailproduct.setImages(listimage);
        detailproduct.setPriceMin(getMaxMinPriceProduct(id).get(0));
        detailproduct.setPriceMax(getMaxMinPriceProduct(id).get(1));
        return detailproduct;
    }
    private List<BigDecimal> getMaxMinPriceProduct(Integer id){
        List<BigDecimal> listPriceMinMax = new ArrayList<>();
        listPriceMinMax.add(productRepository.getMinPrice(id));
        listPriceMinMax.add(productRepository.getMaxPrice(id));
        return listPriceMinMax;
    }
    public List<ProductResponDTO> findByCategoryAndStatus(Integer id){
        List<Product>   products = productRepository.getProductByCategoryIdAndStatus(id, 1);
        System.out.println(products.size());
        List<ProductResponDTO> productResponDTOList = new ArrayList<>();
        for (int i =0; i < products.size(); i++){
            ProductResponDTO productResponDTO = new ProductResponDTO();
            System.out.println(i);
            Product productImage = productRepository.findById(products.get(i).getId()).orElse(null);
            productResponDTO.setIdProduct((products.get(i).getId()));
            productResponDTO.setName(products.get(i).getName());
            productResponDTO.setCategory(products.get(i).getCategory());
            productResponDTO.setPrice(products.get(i).getPrice());
            productResponDTO.setMaterial(products.get(i).getMaterial());
            productResponDTO.setColor(products.get(i).getColor());
            productResponDTO.setDesigns(products.get(i).getDesign());
            productResponDTO.setSize(products.get(i).getSize());

        }
        return productResponDTOList;
    }

    @Override
    public List<Product> findAllwithSort(String field, String direction) {
        Sort sort = Sort.by(Sort.Direction.ASC.name());
        if (direction.equalsIgnoreCase(Sort.Direction.ASC.name())) {
            Sort.by(field).ascending();
        } else {
            Sort.by(field).descending();
        }
        return (List<Product>) productRepository.findAll(sort);
    }
    @Override
    public Optional<Product> getProductBill(Integer idCategory, Integer idDesign, Integer idMaterial, Integer idColor, Integer idSize) {
        return  productRepository.getProductBill(idCategory,idDesign,idMaterial,idColor,idSize);
    }

    @Override
    public Optional<Product> getProductByBarCode(Integer barcode) {
        return productRepository.getProductByBarCode(barcode);

    }

    @Override
    public Product getId(Integer id) {
        return productRepository.getID(id);
    }
    @Override
    public Product getByName(String name) {
        return productRepository.getByName(name);
    }

    @Override
    public List<Product> findProductByPrices() {
        return productRepository.findProductByPrices();
    }

    @Override
    public Page<ProductDetailDTO> getByPage(int pageNumber, int maxRecord, JsonNode findProcuctAll) {
        List<Product> listPrd = productRepository.findProduct();
        System.out.println(listPrd  + "list product");
        List<Product> listFindProduct = new ArrayList<>();
        JsonNode listIdColor = findProcuctAll.get("idColor");
        System.out.println(listIdColor + "ra gi ko");
        JsonNode listIdSize = findProcuctAll.get("idSize");
        System.out.println(listIdSize + "ra gi ko");
        JsonNode listIdMaterial = findProcuctAll.get("idMaterial");
        System.out.println(listIdMaterial + "ra gi ko");
        JsonNode listIdDesign = findProcuctAll.get("idDesign");
        System.out.println(listIdDesign + "ra gi ko");
        Integer sortMinMax = findProcuctAll.get("sortMinMax").asInt();
        if(listPrd.size() != 0){
            for (int i = 0; i < listPrd.size();i++){
                if(listIdColor.size() == 0 && listIdSize.size() == 0 && listIdMaterial.size() == 0 && listIdDesign.size() == 0){
                    listFindProduct = checklist(listFindProduct,listPrd.get(i));
                }else{
                    if (listIdSize.size() != 0){
                        for (int y = 0; y < listIdSize.size(); y++) {
                            if (listIdSize.get(y).asInt() == listPrd.get(i).getSize().getIdSize()){
                                listFindProduct = checklist(listFindProduct,listPrd.get(i));
                            }
                        }
                    }
                    if (listIdMaterial.size() != 0){
                        for (int y = 0; y < listIdMaterial.size(); y++) {
                            if (listIdMaterial.get(y).asInt() == listPrd.get(i).getMaterial().getIdMaterial()){
                                listFindProduct = checklist(listFindProduct,listPrd.get(i));
                            }
                        }
                    }
                    if (listIdColor.size() != 0){
                        for (int y = 0; y < listIdColor.size(); y++) {
                            if (listIdColor.get(y).asInt() == listPrd.get(i).getColor().getIdColor()){
                                listFindProduct = checklist(listFindProduct,listPrd.get(i));
                            }
                        }
                    }
                    if (listIdDesign.size() != 0){
                        for (int y = 0; y < listIdDesign.size(); y++) {
                            if (listIdDesign.get(y).asInt() == listPrd.get(i).getDesign().getIdDesign()){
                                listFindProduct = checklist(listFindProduct,listPrd.get(i));
                            }
                        }
                    }
                }
            }
        }
        List<ProductDetailDTO> listgetALlProduct = new ArrayList<>();
        for ( int x: productRepository.getlistDetailProductCategory()) {
            if (listFindProduct.size() != 0){
                for (int i = 0; i < listFindProduct.size(); i++) {
                    if (listFindProduct.get(i).getCategory().getIdCategory() == x){
                        if (listgetALlProduct.size() == 0){
                            listgetALlProduct.add(getDetailProduct(x));
                        }else{
                            boolean ktt=true;
                            for (int y = 0; y < listgetALlProduct.size(); y++) {
                                if (listgetALlProduct.get(y).getId() ==x){
                                    ktt=false;
                                }
                            }
                            if (ktt){
                                listgetALlProduct.add(getDetailProduct(x));
                                System.out.println(listgetALlProduct.add(getDetailProduct(x)) + "xem cai nay la cai gi");
                            }
                        }
                    }
                }
            }
        }
        BigDecimal priceSalemin;
        BigDecimal priceSalemax;
        List<ProductDetailDTO> listrmove = new ArrayList<>();
        if(!String.valueOf(findProcuctAll.get("priceSalemin")).replaceAll("\"","").equals("")){
            priceSalemin = new BigDecimal(String.valueOf(findProcuctAll.get("priceSalemin")).replaceAll("\"",""));
            if(!String.valueOf(findProcuctAll.get("priceSalemax")).replaceAll("\"","").equals("")){
                priceSalemax = new BigDecimal(String.valueOf(findProcuctAll.get("priceSalemax")).replaceAll("\"",""));
                for (int i = 0; i <listgetALlProduct.size(); i++
                ) {
                    if(listgetALlProduct.get(i).getPriceMin().compareTo(priceSalemax)>0){
                        listrmove.add(listgetALlProduct.get(i));
                    }else if(listgetALlProduct.get(i).getPriceMax().compareTo(priceSalemin)<0){
                        listrmove.add(listgetALlProduct.get(i));
                    }
                }
            }
        }
        if(listgetALlProduct.size()!=0){
            for(int i=0; i<listgetALlProduct.size();i++){
                if(!listgetALlProduct.get(i).getName().contains(String.valueOf(findProcuctAll.get("search")).replaceAll("\"", "").toLowerCase())){
                    if(listrmove.size()==0){
                        listrmove.add(listgetALlProduct.get(i));
                    }else{
                        boolean cc=true;
                        for(int x=0;x<listrmove.size();x++){
                            if (i==x) {
                                cc=false;
                            }
                        }
                        if(cc){
                            listrmove.add(listgetALlProduct.get(i));
                        }
                    }
                }
            }
        }
        if(listrmove!=null){
            listgetALlProduct.removeAll(listrmove);
        }
        Pageable paging = PageRequest.of(pageNumber, maxRecord);
        int start = Math.min((int)paging.getOffset(), listgetALlProduct.size());
        int end = Math.min((start + paging.getPageSize()), listgetALlProduct.size());
        Page<ProductDetailDTO> pageFindProductAll = new PageImpl<>(sortProduct(listgetALlProduct,sortMinMax), paging, listFindProduct.size());
        return pageFindProductAll;
    }

    @Override
    public Product findProductForImages(Integer id) {
        return productRepository.findProductForImages(id);
    }

    private List<ProductDetailDTO> sortProduct(List<ProductDetailDTO> listPRD,Integer check) {
        if(listPRD.size()==0){
            return listPRD;
        }else {
            Comparator<ProductDetailDTO> MinMax = new Comparator<ProductDetailDTO>() {
                @Override
                public int compare(ProductDetailDTO o1, ProductDetailDTO o2) {
                    return o1.getPriceMin().compareTo(o2.getPriceMin());
                }
            };
            Comparator<ProductDetailDTO> MaxMin = new Comparator<ProductDetailDTO>() {
                @Override
                public int compare(ProductDetailDTO o1, ProductDetailDTO o2) {
                    return o2.getPriceMin().compareTo(o1.getPriceMin());
                }
            };
            if(check == 0){
                Collections.sort(listPRD, MinMax);
            }else{
                Collections.sort(listPRD, MaxMin);
            }
            return listPRD;
        }
    }
    private List<Product> checklist( List<Product> listcheck, Product check){
        if(listcheck.size()!=0){
            boolean kT= true;
            for (int i=0;i<listcheck.size();i++){
                if(listcheck.get(i).getId()==check.getId()){
                    kT = false;
                }
            }
            if(kT==true){
                listcheck.add(check);
            }
        }
        else{
            listcheck.add(check);
        }
        return listcheck;
    }

    private List<ProductDetailDTO> getallProduct(){
        List<ProductDetailDTO> listgetAllProduct= new ArrayList<>();
        for (int x: productRepository.getlistDetailProductCategory()
        ) {
            listgetAllProduct.add(getDetailProduct(x));
        }
        return listgetAllProduct;
    }
    @Override
    public Product getdeTailPrd(Integer idDesign, Integer idSize, Integer idColor, Integer idMaterial){
        Product prd = new Product();
        if (productRepository.getDetailPrd(idDesign,idSize,idColor,idMaterial)!=null){
                prd = productRepository.getDetailPrd(idDesign,idSize,idColor,idMaterial);
        }else{
            prd = null;
        }
        return prd;
    }
}
