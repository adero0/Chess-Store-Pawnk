package com.akacin.sklep_szachowy.service;

import com.akacin.sklep_szachowy.dto.OrderDto;
import com.akacin.sklep_szachowy.dto.OrderItemDto;
import com.akacin.sklep_szachowy.model.Order;
import com.akacin.sklep_szachowy.model.OrderItem;
import com.akacin.sklep_szachowy.model.Product;
import com.akacin.sklep_szachowy.model.User;
import com.akacin.sklep_szachowy.repository.OrderRepository;
import com.akacin.sklep_szachowy.repository.ProductRepository;
import com.akacin.sklep_szachowy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    public void createOrder(OrderDto orderDto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(new Date());
        order.setDeliveryDate(new Date(System.currentTimeMillis() + 5 * 24 * 60 * 60 * 1000)); // 5 days from now

        List<OrderItem> orderItems = orderDto.getOrderItems().stream().map(itemDto -> {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemDto.getProductId()));
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setOrder(order);
            return orderItem;
        }).collect(Collectors.toList());

        order.setOrderItems(orderItems);
        order.setTotalPrice(orderItems.stream()
                .map(item -> item.getPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())))
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add));

        orderRepository.save(order);

        sendOrderConfirmationEmail(user, order);
    }

    private void sendOrderConfirmationEmail(User user, Order order) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(user.getEmail());
        email.setSubject("Order Confirmation");
        email.setText(buildEmailBody(order));
        mailSender.send(email);
    }

    private String buildEmailBody(Order order) {
        StringBuilder sb = new StringBuilder();
        sb.append("Thank you for your order!\n\n");
        sb.append("Order Details:\n");
        order.getOrderItems().forEach(item -> {
            sb.append(String.format("- %s (x%d) - %.2f zł\n", item.getProduct().getName(), item.getQuantity(), item.getPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity()))));
        });
        sb.append(String.format("\nTotal Price: %.2f zł\n", order.getTotalPrice()));
        sb.append(String.format("Estimated Delivery Date: %s\n", order.getDeliveryDate().toString()));
        return sb.toString();
    }

    public List<OrderDto> getOrdersForUser(String username) {
        return orderRepository.findByUser_Username(username).stream()
                .map(OrderDto::new)
                .collect(Collectors.toList());
    }
}
