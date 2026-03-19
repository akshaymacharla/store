package com.akshay.ecom_project.service;

import com.akshay.ecom_project.dto.ProductDTO;
import com.akshay.ecom_project.exception.ResourceNotFoundException;
import com.akshay.ecom_project.mapper.ProductMapper;
import com.akshay.ecom_project.model.Product;
import com.akshay.ecom_project.model.User;
import com.akshay.ecom_project.model.Wishlist;
import com.akshay.ecom_project.repo.ProductRepo;
import com.akshay.ecom_project.repo.UserRepo;
import com.akshay.ecom_project.repo.WishlistRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired private WishlistRepo wishlistRepo;
    @Autowired private UserRepo userRepo;
    @Autowired private ProductRepo productRepo;
    @Autowired private ProductMapper productMapper;

    public List<ProductDTO> getWishlistForUser(Long userId) {
        return wishlistRepo.findByUserId(userId).stream()
                .map(w -> productMapper.toDTO(w.getProduct()))
                .collect(Collectors.toList());
    }

    public void addToWishlist(Long userId, int productId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        // Avoid duplicates
        boolean alreadyExists = wishlistRepo.findByUserId(userId).stream()
                .anyMatch(w -> w.getProduct().getId() == productId);
        if (!alreadyExists) {
            Wishlist w = Wishlist.builder().user(user).product(product).build();
            wishlistRepo.save(w);
        }
    }

    public void removeFromWishlist(Long userId, int productId) {
        List<Wishlist> items = wishlistRepo.findByUserId(userId);
        items.stream()
             .filter(w -> w.getProduct().getId() == productId)
             .findFirst()
             .ifPresent(wishlistRepo::delete);
    }
}
