package com.akacin.sklep_szachowy.dto;

public class OrderItemDto {
    private long productId;
    private int quantity;

    public OrderItemDto() {}

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
}
