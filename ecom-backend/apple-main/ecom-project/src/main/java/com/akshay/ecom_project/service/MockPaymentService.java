package com.akshay.ecom_project.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Mock payment service that simulates Stripe-like payment processing.
 * In production, replace this with actual Stripe SDK integration.
 */
@Service
public class MockPaymentService {

    private static final Logger logger = LoggerFactory.getLogger(MockPaymentService.class);

    /**
     * Simulates a payment.
     * @param paymentToken  A token string from the client (e.g., "tok_visa" for simulate success, "tok_fail" to simulate failure)
     */
    public boolean processPayment(String paymentToken) {
        if (paymentToken == null || paymentToken.isBlank()) {
            logger.warn("Payment attempted with null/blank token");
            return false;
        }
        // "tok_fail" simulates a declined card for testing
        if ("tok_fail".equalsIgnoreCase(paymentToken)) {
            logger.warn("Payment declined for token: {}", paymentToken);
            return false;
        }
        // All other tokens succeed (simulate Stripe test tokens like tok_visa, tok_mastercard)
        logger.info("Payment processed successfully for token: {}", paymentToken);
        return true;
    }
}
