package com.akacin.sklep_szachowy.dto;

import com.akacin.sklep_szachowy.model.Order;
import com.akacin.sklep_szachowy.model.enums.EOrderStatus;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class OrderDto {
    private Long id;
    private List<OrderItemDto> orderItems;
    private BigDecimal totalPrice;
    private Date orderDate;
    private Date deliveryDate;
    private EOrderStatus status;

    public OrderDto() {
        // Default constructor for JSON deserialization
    }

    public OrderDto(Order order) {
        this.id = order.getId();
        this.totalPrice = order.getTotalPrice();
        this.orderDate = order.getOrderDate();
        this.deliveryDate = order.getDeliveryDate();
        this.status = order.getStatus();
        this.orderItems = order.getOrderItems().stream()
                .map(OrderItemDto::new)
                .collect(Collectors.toList());
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<OrderItemDto> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemDto> orderItems) {
        this.orderItems = orderItems;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public Date getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(Date deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public EOrderStatus getStatus() {
        return status;
    }

    public void setStatus(EOrderStatus status) {
        this.status = status;
    }
}