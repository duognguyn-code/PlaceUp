package com.poly.be_duan.restcontrollers.admin;

import com.github.sarxos.webcam.Webcam;
import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.DecoderResult;
import com.google.zxing.common.DetectorResult;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.multi.qrcode.detector.MultiDetector;
import com.google.zxing.qrcode.decoder.Decoder;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.poly.be_duan.entities.Product;
import com.poly.be_duan.service.BillService;
import com.poly.be_duan.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.Dimension;
import java.awt.image.BufferedImage;
import java.io.*;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/cart")
public class CartAdminRestController {

    @Autowired
    BillService billService;

    @Autowired
    ProductService productService;

    @GetMapping("")
    public Optional<Product> SearchByQRCode() throws ParseException,Exception {
        Webcam webcam = Webcam.getDefault();
        webcam.close();
        webcam.setViewSize(new Dimension(640, 480));
        webcam.open();
        int id = 0;
        try {
            ImageIO.write(webcam.getImage(), "PNG", new File("C:\\Users\\Windows\\Pictures\\Saved Pictures\\QRCODE.png"));
            String filePath = "C:\\Users\\Windows\\Pictures\\Saved Pictures\\QRCODE.png";

            String charset = "UTF-8";
            Map hintMap = new HashMap();

            BufferedImage image = webcam.getImage();
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", os);
            InputStream is = new ByteArrayInputStream(os.toByteArray());
            BinaryBitmap binaryBitmap = new BinaryBitmap(
                    new HybridBinarizer(new BufferedImageLuminanceSource(ImageIO.read(is))));


            BitMatrix bm = binaryBitmap.getBlackMatrix();

            MultiDetector detector = new MultiDetector(bm);
            DetectorResult dResult = detector.detect();
            BitMatrix QRImageData = null;

            if (dResult != null) {
                QRImageData = dResult.getBits();
                hintMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
//                 String a = readQRCode(filePath, charset, hintMap, QRImageData);
//                id = Integer.parseInt(a);
                 id = Integer.parseInt(readQRCode(filePath, charset, hintMap, QRImageData));

            }
        } catch (IOException e) {
            // TODO Auto-generated catch block
            System.out.println("Vui Long Quet Lai Ma QR Code");
            // e.printStackTrace();
        } catch (NotFoundException e) {
            // TODO Auto-generated catch block
            System.out.println("Vui Long Quet Lai Ma QR Code");
        } catch (FormatException e) {
            // TODO Auto-generated catch block
            System.out.println("Vui Long Quet Lai Ma QR Code");
        }
//        System.out.println( productService.getProductByBarCode(id));
        if (id==0){
            return null;
        }else {
            return productService.getProductByBarCode(id);
        }
    }

    public static String readQRCode(String filePath, String charset, Map hintMap, BitMatrix qRImageData)
            throws FileNotFoundException, IOException, NotFoundException, FormatException {
        BinaryBitmap binaryBitmap = new BinaryBitmap(
                new HybridBinarizer(new BufferedImageLuminanceSource(ImageIO.read(new FileInputStream(filePath)))));
        Decoder dr = new Decoder();
        DecoderResult qrCodeResult = null;
        try {
            qrCodeResult = dr.decode(qRImageData);
        } catch (ChecksumException e) {
            // TODO Auto-generated catch block
            System.out.println("Vui Long Quet Lai Ma QR Code");
        }
        return qrCodeResult.getText();
    }

    @GetMapping("/{id}")
    public Optional<Product> SearchByID(@PathVariable("id")Integer id){
        return productService.findById(id);
    }

    @GetMapping("/idBill")
    public Integer MaxIdBill(){
        return billService.MaxIdBill();
    }
}
