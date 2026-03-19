package com.akshay.ecom_project.service;

import com.akshay.ecom_project.dto.OrderDTO;
import com.akshay.ecom_project.dto.OrderItemDTO;
import com.akshay.ecom_project.dto.PlaceOrderRequest;
import com.akshay.ecom_project.exception.ResourceNotFoundException;
import com.akshay.ecom_project.model.Order;
import com.akshay.ecom_project.model.OrderItem;
import com.akshay.ecom_project.model.Product;
import com.akshay.ecom_project.model.User;
import com.akshay.ecom_project.repo.OrderRepo;
import com.akshay.ecom_project.repo.ProductRepo;
import com.akshay.ecom_project.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private OrderRepo orderRepo;
    @Autowired private UserRepo userRepo;
    @Autowired private ProductRepo productRepo;
    @Autowired private MockPaymentService paymentService;

    @Transactional
    public OrderDTO placeOrder(PlaceOrderRequest request) {
        User user = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Mock payment processing
        boolean paymentSuccess = paymentService.processPayment(request.getPaymentToken());
        if (!paymentSuccess) {
            throw new RuntimeException("Payment failed. Please try again.");
        }

        Order order = Order.builder()
                .user(user)
                .status("PENDING")
                .orderDate(LocalDateTime.now())
                .build();

        List<OrderItem> orderItems = request.getItems().stream().map(itemDTO -> {
            Product product = productRepo.findById(itemDTO.getProductId().intValue())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemDTO.getProductId()));
            return OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemDTO.getQuantity())
                    .price(product.getPrice())
                    .build();
        }).collect(Collectors.toList());

        BigDecimal total = orderItems.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setOrderItems(orderItems);
        order.setTotalAmount(total);
        order.setStatus("CONFIRMED");

        Order saved = orderRepo.save(order);
        return mapToDTO(saved);
    }

    public List<OrderDTO> getOrdersByUser(Long userId) {
        return orderRepo.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return mapToDTO(order);
    }

    private OrderDTO mapToDTO(Order order) {
        List<OrderItemDTO> items = order.getOrderItems().stream().map(item -> OrderItemDTO.builder()
                .productId((long) item.getProduct().getId())
                .productName(item.getProduct().getName())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .build()).collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .userEmail(order.getUser().getEmail())
                .orderItems(items)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .orderDate(order.getOrderDate())
                .build();
    }
}
