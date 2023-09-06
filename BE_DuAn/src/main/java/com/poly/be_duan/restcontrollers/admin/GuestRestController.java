package com.poly.be_duan.restcontrollers.admin;

import com.fasterxml.jackson.databind.JsonNode;
import com.poly.be_duan.dto.ProductDetailDTO;
import com.poly.be_duan.dto.ProductResponDTO;
import com.poly.be_duan.dto.UpdatePasswordDTO;
import com.poly.be_duan.entities.*;
import com.poly.be_duan.service.*;
import com.poly.be_duan.utils.Username;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping(value="/rest/guest")
public class GuestRestController {

    Logger logger = Logger.getLogger(GuestRestController.class);
    @Autowired
    private AccountService accountService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private ProductService productService;

    @Autowired
    private BillDetailService billDetailService;
    @Autowired
    private BillService billService;

    @Autowired
    private SendMailService sendMailService;

    @Autowired
    private AuthService authService;

    @Autowired
    private ColorService colorService;

    @Autowired
    private MaterialService materialService;

    @Autowired
    private DesignService designService;

    @Autowired
    private SizeService sizeService;



    Account account = null;

    Bill bill = null;
    @GetMapping("/product/detailproduct/{id}")
    public List<ProductResponDTO> findByCateProductId(@PathVariable("id") Integer id) throws Exception{
        Optional<Category> cate = categoryService.findById(id);
        if(cate.isEmpty()){
            return null;
        }
        List<ProductResponDTO> productResponDTOList = productService.findByCategoryAndStatus(cate.get().getIdCategory());
        if (productResponDTOList == null) throw new Exception("không tìm thấy sản phẩm");
        return productResponDTOList;
    }
    @RequestMapping("/product/product_detail/{idcate}")
    public ProductDetailDTO getDetailProduct(@PathVariable("idcate") Integer id){
        return productService.getDetailProduct(id);
    }
    @RequestMapping("/product/get_detail_product/{idDesign}/{idSize}/{idColor}/{idMaterial}")
    public Product getdetailProduct(
            @PathVariable("idDesign")Integer idDesign,
            @PathVariable("idSize")Integer idSize,
            @PathVariable("idColor")Integer idColor,
            @PathVariable("idMaterial")Integer idMaterial
    ){
        return productService.getdeTailPrd(idDesign,idSize,idColor,idMaterial);
    }
    @PostMapping("/order/add")
    public Bill order(@RequestBody Bill bill){
        account = accountService.findByUsername(Username.getUserName());
        if(bill.getAddress()==null||account==null){
            return null;
        }
        Date date = new Date();
        this.bill = bill;
        bill.setCreateDate(date);
        bill.setAccount(account);

        billService.save(bill);
        sendMailService.sendEmailBill("nguyentungduonglk1@gmail.com","iscdvtuyqsfpwmbp",bill.getAccount().getEmail(), bill.getPersonTake(),bill);
        logger.info("-- Order: "+bill.getId());
        return bill;
    }


    @PostMapping("/order/detail/add")
    public JsonNode cartItems(@RequestBody JsonNode cartItems) {
        account = accountService.findByUsername(Username.getUserName());
        Bill_detail bill_detail;
        BigDecimal price = null;
        for (int i = 0; i < cartItems.size(); i++) {
            JsonNode productNode = cartItems.get(i).get("product");
            if (productNode != null && productNode.get("id") != null) {
                bill_detail = new Bill_detail();
                Optional<Product> product = productService.findById(productNode.get("id").asInt());
                if (product.isPresent()) {
                    bill_detail.setProduct(product.get());
                    bill_detail.setBill(bill);
                    bill_detail.setStatus(1);
                    bill_detail.setDescription("Không có ghi chú");
                    bill_detail.setQuantity(cartItems.get(i).get("quantity").asInt());
                    price = new BigDecimal(productNode.get("price").asDouble());
                    bill_detail.setPrice(price);
                    billDetailService.save(bill_detail);

                    int quantityInCart = cartItems.get(i).get("quantity").asInt();
                    int availableQuantity = product.get().getQuantity();
                    int remainingQuantity = availableQuantity - quantityInCart;
                    product.get().setQuantity(remainingQuantity);
                    productService.save(product.get());
                }
            }
        }
        return cartItems;
    }
    @GetMapping("/getAccount")
    public Author getAccountActive() {
        System.out.println(Username.getUserName() + "null");
        Author author = authService.searchAccountByUsername(Username.getUserName());
        System.out.println(author + "null ");
        return author;
    }
    @GetMapping("/getAllColor")
    public List<Color> getAllColor() {
        return colorService.getAll();
    }
    @GetMapping("/getAllMaterial")
    public List<Material> getAllMaterial() {
        return materialService.getAll();
    }

    @GetMapping("/getALlDesign")
    public List<Designs> getAllDesigns() {
        return designService.getAll();
    }

    @GetMapping("/getALlSize")
    public List<Size> getAllSIze() {
        return sizeService.getAll();
    }

    @RequestMapping(value = "/product/findProductByPrice",method = RequestMethod.GET)
    public List<Product> findProductByPrice(){
        List<Product> listproduct = productService.findProductByPrices();
        if(listproduct.isEmpty()){
            return  null;
        }
        return listproduct;
    }
    @RequestMapping("/product/findproduct/{page}")
    public Page<ProductDetailDTO> findProduct(
            @PathVariable ("page") Integer page,
            @RequestBody JsonNode findProcuctAll
    ) {
        return productService.getByPage(page,9,findProcuctAll);
    }

    @PostMapping("/updatePassword")
    public Boolean updatePassword (@RequestBody UpdatePasswordDTO updatePasswordDTO){

        return accountService.updatePassword(updatePasswordDTO);
    }

    @GetMapping("/forgetPassword/{email}")
    public void forgetPassword (@PathVariable("email")String email, Model model){
        try {
            if (email != null){
                sendMailService.SendEmailChangePass("nguyentungduonglk1@gmail.com", "iscdvtuyqsfpwmbp",email);
            }
        }catch (Exception e){
            e.getMessage();
        }
    }
}
