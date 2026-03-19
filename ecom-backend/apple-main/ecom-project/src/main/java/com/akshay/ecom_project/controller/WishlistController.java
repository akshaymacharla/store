package com.akshay.ecom_project.controller;

import com.akshay.ecom_project.dto.ProductDTO;
import com.akshay.ecom_project.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<ProductDTO>> getWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlistForUser(userId));
    }

    @PostMapping("/{userId}/add/{productId}")
    public ResponseEntity<String> addToWishlist(@PathVariable Long userId, @PathVariable int productId) {
        wishlistService.addToWishlist(userId, productId);
        return ResponseEntity.ok("Product added to wishlist");
    }

    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<String> removeFromWishlist(@PathVariable Long userId, @PathVariable int productId) {
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok("Product removed from wishlist");
    }
}
