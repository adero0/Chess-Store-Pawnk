
package com.akacin.sklep_szachowy.service;

import com.akacin.sklep_szachowy.dto.ProductDto;
import com.akacin.sklep_szachowy.dto.ProductRequestDto;
import com.akacin.sklep_szachowy.model.Category;
import com.akacin.sklep_szachowy.model.Product;
import com.akacin.sklep_szachowy.model.User;
import com.akacin.sklep_szachowy.repository.CategoryRepository;
import com.akacin.sklep_szachowy.repository.ProductRepository;
import com.akacin.sklep_szachowy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    public ProductDto createProduct(ProductRequestDto productRequest, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Category category = categoryRepository.findByName(productRequest.getCategoryName())
                .orElseGet(() -> categoryRepository.save(new Category(productRequest.getCategoryName())));

        Product product = new Product(
                productRequest.getName(),
                productRequest.getDescription(),
                productRequest.getPrice(),
                category,
                author,
                productRequest.getImageUrl()
        );
        product.setApproved(false); // Products need to be approved by a moderator/admin

        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    public List<ProductDto> getApprovedProducts() {
        return productRepository.findAll().stream()
                .filter(Product::isApproved)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getProductsByCategory(String categoryName) {
        return productRepository.findByCategoryName(categoryName).stream()
                .filter(Product::isApproved)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDto(product);
    }

    private ProductDto convertToDto(Product product) {
        return new ProductDto(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getCategory() != null ? product.getCategory().getName() : null,
                product.getAuthor() != null ? product.getAuthor().getUsername() : null,
                product.getImageUrl()
        );
    }
}
