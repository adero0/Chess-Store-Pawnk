package com.akacin.sklep_szachowy.controllers;

import com.akacin.sklep_szachowy.dto.ProductDto;
import com.akacin.sklep_szachowy.dto.ProductRequestDto;
import com.akacin.sklep_szachowy.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    private final ProductService productService;

    @Value("${app.upload.dir:uploads/products}")
    private String uploadDir;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<ProductDto> createProduct(
            @RequestPart("product") ProductRequestDto productRequest,
            @RequestPart("image") MultipartFile image,
            Authentication authentication) {
        logger.info("Received request to create a new product: {}", productRequest.getName());
        try {
            String imageUrl = saveImage(image);
            productRequest.setImageUrl(imageUrl);
            ProductDto newProduct = productService.createProduct(productRequest, authentication.getName());
            logger.info("Product created successfully with ID: {}", newProduct.getId());
            return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
        } catch (IOException e) {
            logger.error("Failed to save image for product: {}", productRequest.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            logger.error("User does not have permission to create product: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    private String saveImage(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        logger.info("Absolute path of upload directory: {}", uploadPath.toAbsolutePath());

        if (!Files.exists(uploadPath)) {
            logger.info("Creating upload directory: {}", uploadPath.toAbsolutePath());
            Files.createDirectories(uploadPath);
        }

        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file.");
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null && originalFilename.contains(".") ?
            originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
        String fileName = UUID.randomUUID().toString() + fileExtension;

        Path filePath = uploadPath.resolve(fileName);
        logger.info("Saving image to: {}", filePath.toAbsolutePath());
        Files.copy(file.getInputStream(), filePath);
        logger.info("Image saved successfully: {}", fileName);

        return "/uploads/products/" + fileName;
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllApprovedProducts() {
        List<ProductDto> products = productService.getApprovedProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<ProductDto>> getProductsByCategory(@PathVariable String categoryName) {
        List<ProductDto> products = productService.getProductsByCategory(categoryName);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
}
