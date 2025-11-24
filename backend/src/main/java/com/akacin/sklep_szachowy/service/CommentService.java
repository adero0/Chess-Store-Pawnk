package com.akacin.sklep_szachowy.service;

import com.akacin.sklep_szachowy.dto.CommentDto;
import com.akacin.sklep_szachowy.dto.CommentRequestDto;
import com.akacin.sklep_szachowy.model.Comment;
import com.akacin.sklep_szachowy.model.Product;
import com.akacin.sklep_szachowy.model.Role;
import com.akacin.sklep_szachowy.model.User;
import com.akacin.sklep_szachowy.model.enums.ECommentStatus;
import com.akacin.sklep_szachowy.model.enums.ERole;
import com.akacin.sklep_szachowy.repository.CommentRepository;
import com.akacin.sklep_szachowy.repository.ProductRepository;
import com.akacin.sklep_szachowy.repository.UserRepository;
import com.akacin.sklep_szachowy.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CommentDto> getCommentsForProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Error: Product is not found."));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return commentRepository.findByProductIdAndStatus(productId, ECommentStatus.ACCEPTED).stream()
                    .map(CommentDto::fromEntity)
                    .collect(Collectors.toList());
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        boolean isModeratorForCategory = user.getRoles().stream()
                .anyMatch(role -> ERole.ROLE_MODERATOR.equals(role.getName()) &&
                        role.getCategory() != null &&
                        role.getCategory().getId().equals(product.getCategory().getId()));

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(role -> ERole.ROLE_ADMIN.equals(role.getName()));

        if (isAdmin || isModeratorForCategory) {
            return commentRepository.findByProductId(productId).stream()
                    .map(CommentDto::fromEntity)
                    .collect(Collectors.toList());
        }

        return commentRepository.findByProductIdAndStatus(productId, ECommentStatus.ACCEPTED).stream()
                .map(CommentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentDto createComment(Long productId, CommentRequestDto commentRequestDto, String username) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Error: Product is not found."));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        Comment comment = new Comment(commentRequestDto.getContent(), product, user);
        comment = commentRepository.save(comment);

        return CommentDto.fromEntity(comment);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getPendingCommentsForModerator(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        List<Integer> categoryIds = user.getRoles().stream()
                .filter(role -> ERole.ROLE_MODERATOR.equals(role.getName()) && role.getCategory() != null)
                .map(role -> role.getCategory().getId())
                .collect(Collectors.toList());

        if (categoryIds.isEmpty()) {
            return Collections.emptyList();
        }

        return commentRepository.findByProduct_Category_IdInAndStatus(categoryIds, ECommentStatus.PENDING).stream()
                .map(CommentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateCommentStatus(Long commentId, ECommentStatus status) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Error: Comment not found."));
        comment.setStatus(status);
        commentRepository.save(comment);
    }

    @Transactional(readOnly = true)
    public int countPendingCommentsForModerator(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        List<Integer> categoryIds = user.getRoles().stream()
                .filter(role -> ERole.ROLE_MODERATOR.equals(role.getName()) && role.getCategory() != null)
                .map(role -> role.getCategory().getId())
                .collect(Collectors.toList());

        if (categoryIds.isEmpty()) {
            return 0;
        }

        return commentRepository.countByProduct_Category_IdInAndStatus(categoryIds, ECommentStatus.PENDING);
    }
}