package com.akacin.sklep_szachowy.dto;

import java.util.List;

public class OrderDto {
    private List<OrderItemDto> orderItems;

    public OrderDto() {}

    public List<OrderItemDto> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemDto> orderItems) {
        this.orderItems = orderItems;
    }
}
