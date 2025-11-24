package com.akacin.sklep_szachowy.dto;

import com.akacin.sklep_szachowy.model.Comment;
import com.akacin.sklep_szachowy.model.enums.ECommentStatus;

import java.time.LocalDateTime;

public class CommentDto {
    private Long id;
    private String content;
    private String authorName;
    private LocalDateTime createdAt;
    private ECommentStatus status;
    private Long productId;
    private String productName;

    public CommentDto(Long id, String content, String authorName, LocalDateTime createdAt, ECommentStatus status, Long productId, String productName) {
        this.id = id;
        this.content = content;
        this.authorName = authorName;
        this.createdAt = createdAt;
        this.status = status;
        this.productId = productId;
        this.productName = productName;
    }

    public static CommentDto fromEntity(Comment comment) {
        return new CommentDto(
                comment.getId(),
                comment.getContent(),
                comment.getAuthor().getUsername(),
                comment.getCreatedAt(),
                comment.getStatus(),
                comment.getProduct().getId(),
                comment.getProduct().getName()
        );
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ECommentStatus getStatus() {
        return status;
    }

    public void setStatus(ECommentStatus status) {
        this.status = status;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }
}
