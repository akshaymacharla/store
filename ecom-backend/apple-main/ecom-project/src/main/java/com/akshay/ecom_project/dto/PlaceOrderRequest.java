package com.akshay.ecom_project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlaceOrderRequest {
    private Long userId;
    private List<OrderItemDTO> items;
    private String paymentToken; // mock stripe token
}
