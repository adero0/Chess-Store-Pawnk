package com.akacin.sklep_szachowy.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "slider_configs")
public class SliderConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "slider_products",
            joinColumns = @JoinColumn(name = "slider_config_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    @OrderColumn(name = "product_order")
    private List<Product> products = new ArrayList<>();

    private int displayCount = 3;

    public SliderConfig() {
    }

    public SliderConfig(List<Product> products, int displayCount) {
        this.products = products;
        this.displayCount = displayCount;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public int getDisplayCount() {
        return displayCount;
    }

    public void setDisplayCount(int displayCount) {
        this.displayCount = displayCount;
    }
}
