package com.akacin.sklep_szachowy.dto;

import com.akacin.sklep_szachowy.model.SliderConfig;

import java.util.List;
import java.util.stream.Collectors;

public class SliderConfigDto {
    private Long id;
    private List<ProductDto> products;
    private int displayCount;

    public SliderConfigDto(Long id, List<ProductDto> products, int displayCount) {
        this.id = id;
        this.products = products;
        this.displayCount = displayCount;
    }

    public static SliderConfigDto fromEntity(SliderConfig entity) {
        List<ProductDto> productDtos = entity.getProducts().stream()
                .map(product -> new ProductDto(
                        product.getId(),
                        product.getName(),
                        product.getDescription(),
                        product.getPrice(),
                        product.getCategory() != null ? product.getCategory().getName() : null,
                        product.getAuthor() != null ? product.getAuthor().getUsername() : null,
                        product.getImageUrl()
                ))
                .collect(Collectors.toList());

        return new SliderConfigDto(entity.getId(), productDtos, entity.getDisplayCount());
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<ProductDto> getProducts() {
        return products;
    }

    public void setProducts(List<ProductDto> products) {
        this.products = products;
    }

    public int getDisplayCount() {
        return displayCount;
    }

    public void setDisplayCount(int displayCount) {
        this.displayCount = displayCount;
    }
}
