package com.akacin.sklep_szachowy.dto;

import com.akacin.sklep_szachowy.model.OrderItem;
import java.math.BigDecimal;

public class OrderItemDto {
    private long productId;
    private int quantity;
    private String productName;
    private BigDecimal price;

    public OrderItemDto() {}

    public OrderItemDto(OrderItem orderItem) {
        this.productId = orderItem.getProduct().getId();
        this.quantity = orderItem.getQuantity();
        this.productName = orderItem.getProduct().getName();
        this.price = orderItem.getPrice();
    }

    public long getProductId() {
        return productId;
    }

    public void setProductId(long productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
