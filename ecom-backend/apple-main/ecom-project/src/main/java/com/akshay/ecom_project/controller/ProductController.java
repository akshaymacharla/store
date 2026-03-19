package com.akshay.ecom_project.controller;

import com.akshay.ecom_project.dto.ProductDTO;
import com.akshay.ecom_project.model.Product;
import com.akshay.ecom_project.repo.ProductRepo;
import com.akshay.ecom_project.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ProductController {

   @Autowired
    private ProductService service;

    @Autowired
    private ProductRepo productRepo;



    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getAllProducts(){
         return new ResponseEntity<>(service.getAllProducts(), HttpStatus.OK);
    }

    // Advanced search/filter endpoint with pagination
    @GetMapping("/products/search")
    public ResponseEntity<Page<ProductDTO>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean available,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        return ResponseEntity.ok(service.searchProducts(keyword, category, minPrice, maxPrice, available, page, size, sortBy));
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable int id){
       return new ResponseEntity<>(service.getProductById(id),HttpStatus.OK);
    }
    
    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart("product") ProductDTO productDTO,
                                        @RequestPart("imageFile") MultipartFile imageFile){
       try {
           ProductDTO savedProduct = service.addProduct(productDTO, imageFile);
           return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
       }
       catch(Exception e){
           return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
       }
    }
    @GetMapping("/product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable int productId){
     Product product = productRepo.findById(productId).orElseThrow();
     byte[] imageFile = product.getImageData();
     return ResponseEntity.ok()
             .contentType(MediaType.valueOf(product.getImageType()))
             .body(imageFile);
    }
    
    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable int id, 
                                                @RequestPart("product") ProductDTO productDTO,
                                                @RequestPart(value = "imageFile", required = false) MultipartFile imageFile){
        try {
            service.updateProduct(id, productDTO, imageFile);
            return new ResponseEntity<>("updated",HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to update: " + e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }
    
    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id){
       service.deleteProduct(id);
       return new ResponseEntity<>("Deleted",HttpStatus.OK);
    }
}
