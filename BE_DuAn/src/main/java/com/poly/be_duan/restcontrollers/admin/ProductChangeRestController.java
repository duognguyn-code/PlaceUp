package com.poly.be_duan.restcontrollers.admin;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.poly.be_duan.dto.ChangeProductDetailDTO;
import com.poly.be_duan.dto.ProductChangeDTO;
import com.poly.be_duan.entities.Bill_detail;
import com.poly.be_duan.entities.ChangeProductDetail;
import com.poly.be_duan.entities.Image;
import com.poly.be_duan.entities.ProductChange;
import com.poly.be_duan.repositories.BillDetailRepository;
import com.poly.be_duan.repositories.BillRepository;
import com.poly.be_duan.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping(value= "/rest/user/productchange")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ProductChangeRestController {
    private final ProductChangeService productChangeService;
    private final ChangeProductDetailService changeProductDetailService;
    private final Cloudinary cloud;
    private final ImageService imageService;
    private final AccountService accountService;
    private final BillDetailService billDetailService;
    private final BillDetailRepository billDetailRepository;
    private final BillRepository billRepository;

    @RequestMapping(value = "/findProductChange/{id}",method = RequestMethod.GET)
    public Bill_detail findByProductChange (@PathVariable("id") Integer id){
        Optional<Bill_detail> orderDetails =  billDetailRepository.findById(id);
        return orderDetails.get();
    }


    @RequestMapping(value = "/save",method = RequestMethod.POST, consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public void requestProductChange(@ModelAttribute ProductChangeDTO productChangeDTO){
        try {
            if(productChangeDTO != null){
                ProductChange p =  new ProductChange();
                p.setAccount(productChangeDTO.getAccount());
                p.setDateChange(new Date());
                p.setDescription(productChangeDTO.getDescription());
                p.setEmail(productChangeDTO.getEmail());
                p.setQuantityProductChange(productChangeDTO.getQuantityProductChange());
                p.setBillDetail(productChangeDTO.getBill_detail());
                p.setPhone(productChangeDTO.getPhone());
                p.setStatus(1);
                productChangeService.save(p);
                Bill_detail bill_detail = billDetailRepository.findById(productChangeDTO.getBill_detail().getId()).get();
                bill_detail.setStatus(3);
                billDetailService.update(bill_detail, bill_detail.getId());
                for (MultipartFile multipartFile: productChangeDTO.getFiles()) {
                    Map<String, String> params = ObjectUtils.asMap(
                            "cloud_name", "dcll6yp9s",
                            "api_key", "916219768485447",
                            "api_secret", "zUlI7pdWryWsQ66Lrc7yCZW0Xxg",
                            "folder", "c202a2cae1893315d8bccb24fd1e34b816"
                    );

                    String resourceType = multipartFile.getContentType().startsWith("image/") ? "image" : "video";
                    params.put("resource_type", resourceType);

                    Map r = this.cloud.uploader().upload(multipartFile.getBytes(), params);

                    Image image = new Image();
                    image.setUrlimage(r.get("secure_url").toString());
                    image.setProductChange(p);
                    imageService.create(image);
                }
            }else System.out.println("null");
        }catch (Exception e){
            e.getMessage();
        }

    }
    @RequestMapping(path = "/saveRequest",method = RequestMethod.POST,
            consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public void saveRequest(@ModelAttribute ChangeProductDetailDTO changeProductDetailDTO){
        try {
            if(changeProductDetailDTO != null){
                System.out.println("Khong loi gi a");
                ChangeProductDetail changeProductDetail = new ChangeProductDetail();
                changeProductDetail.setBillDetail(changeProductDetailDTO.getBill_detail());
                changeProductDetailService.createChangeDetails(changeProductDetailDTO.getBill_detail().getId());
                Optional<Bill_detail> bill_detail = billDetailService.findById(changeProductDetailDTO.getBill_detail().getId());
                System.out.println(bill_detail + "rỗng hay không");
                bill_detail.orElseThrow().setStatus(1);
                System.out.println(bill_detail.get().getDateReturn());
                billDetailService.save(bill_detail.get());
            }
        }catch (Exception e){
            e.getMessage();
        }
    }

    @RequestMapping(value= "/getAll", method = RequestMethod.GET)
    public List<ProductChange> listProductchange(){
        List<ProductChange> productChangeList = productChangeService.listProductChange();
        if(productChangeList.isEmpty()){
            return  null;
        }
        Comparator<ProductChange> comparator = new Comparator<ProductChange>() {
            @Override
            public int compare(ProductChange o1, ProductChange o2) {
                return o2.getId().compareTo(o1.getId());
            }
        };
        Collections.sort(productChangeList, comparator);
        return productChangeList;
    }
    @GetMapping("/{phone}/{status}")
    public List<ProductChange> findProductChangeByStatus(@PathVariable(value = "status")Integer status,@PathVariable(value = "phone")String phone){
        System.out.println("seảch");
        if (phone.equals(" ")) {
            phone = "0";
        }
        return productChangeService.findProductChangeByStatus(status, phone);
    }

    @RequestMapping(value= "/getPrChangeDetails/{id}",  method =  RequestMethod.GET )
    public ChangeProductDetail listPrChangeDetails(@PathVariable("id") ProductChange  id) {
        ChangeProductDetail listPrChangeDetails = changeProductDetailService.findPrChangeDetails(id);
        if(listPrChangeDetails == null){
            return null;
        }
        return listPrChangeDetails;
    }

    @RequestMapping(value= "/getPrChangeByUser/{username}", method =  RequestMethod.GET)
    public List<ProductChange> findByUser(@RequestParam("username") String user) {
        List<ProductChange> listPrChangeDetails = productChangeService.findByUsername("Dương");
        return listPrChangeDetails;
    }

    @GetMapping(value = "/findImageByPr/{id}")
    public List<Image>   findAllImageByPr(@PathVariable("id") Integer id){
        List<Image> listImage = imageService.findImageByPr(id);
        if(listImage !=null){
            return listImage;
        }
        return null;
    }
    @PutMapping("/updateqQuantity/{id}/{quantity}")
    public ProductChange updateQuantity(@PathVariable(value = "id")Integer id,@PathVariable(value = "quantity")Integer quantity){
        System.out.println(quantity);
        ProductChange productChange =productChangeService.findByStatus(id);
        productChange.setQuantityProductChange(quantity);
        return productChangeService.save(productChange);
    }

    @GetMapping("/forReasonreturn/{id}")
    public Bill_detail getForProductChange(@PathVariable(value = "id")String id){
        return billDetailService.getForProductChange(id);
    }

    @GetMapping("/sumStatus/{number}")
    public Integer sumStatus(@PathVariable(value = "number")String number){
        return productChangeService.sumStatus(number);
    }
}