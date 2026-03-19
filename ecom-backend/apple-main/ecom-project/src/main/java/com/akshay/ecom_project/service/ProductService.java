package com.akshay.ecom_project.service;

import com.akshay.ecom_project.dto.ProductDTO;
import com.akshay.ecom_project.mapper.ProductMapper;
import com.akshay.ecom_project.model.Category;
import com.akshay.ecom_project.model.Product;
import com.akshay.ecom_project.repo.CategoryRepo;
import com.akshay.ecom_project.repo.ProductRepo;
import com.akshay.ecom_project.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;
    
    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private ProductMapper productMapper;

    public List<ProductDTO> getAllProducts() {
        return repo.findAll().stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Advanced search with filters and pagination
    public Page<ProductDTO> searchProducts(String keyword, String category,
                                            BigDecimal minPrice, BigDecimal maxPrice,
                                            Boolean available, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, sortBy));
        return repo.findWithFilters(keyword, category, minPrice, maxPrice, available, pageable)
                   .map(productMapper::toDTO);
    }

    public ProductDTO getProductById(int id) {
        Product product = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return productMapper.toDTO(product);
    }

    public ProductDTO addProduct(ProductDTO productDTO, MultipartFile imageFile) throws IOException {
        Product product = productMapper.toEntity(productDTO);
        
        if (productDTO.getCategory() != null) {
            Category cat = categoryRepo.findAll().stream()
                .filter(c -> c.getName().equalsIgnoreCase(productDTO.getCategory()))
                .findFirst().orElseGet(() -> categoryRepo.save(Category.builder().name(productDTO.getCategory()).build()));
            product.setCategory(cat);
        }

        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageData(imageFile.getBytes());
        Product savedProduct = repo.save(product);
        return productMapper.toDTO(savedProduct);
    }

    public ProductDTO updateProduct(int id, ProductDTO productDTO, MultipartFile imageFile) throws IOException {
        Product existingProduct = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        Product productToUpdate = productMapper.toEntity(productDTO);
        productToUpdate.setId(id);
        
        if (productDTO.getCategory() != null) {
            Category cat = categoryRepo.findAll().stream()
                .filter(c -> c.getName().equalsIgnoreCase(productDTO.getCategory()))
                .findFirst().orElseGet(() -> categoryRepo.save(Category.builder().name(productDTO.getCategory()).build()));
            productToUpdate.setCategory(cat);
        } else {
            productToUpdate.setCategory(existingProduct.getCategory());
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            productToUpdate.setImageData(imageFile.getBytes());
            productToUpdate.setImageName(imageFile.getOriginalFilename());
            productToUpdate.setImageType(imageFile.getContentType());
        } else {
            productToUpdate.setImageData(existingProduct.getImageData());
            productToUpdate.setImageName(existingProduct.getImageName());
            productToUpdate.setImageType(existingProduct.getImageType());
        }
        
        Product updatedProduct = repo.save(productToUpdate);
        return productMapper.toDTO(updatedProduct);
    }

    public void deleteProduct(int id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        repo.deleteById(id);
    }
}
