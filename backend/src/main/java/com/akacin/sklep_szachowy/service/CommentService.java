package com.akacin.sklep_szachowy.service;

import com.akacin.sklep_szachowy.dto.CommentDto;
import com.akacin.sklep_szachowy.dto.CommentRequestDto;
import com.akacin.sklep_szachowy.model.Comment;
import com.akacin.sklep_szachowy.model.Product;
import com.akacin.sklep_szachowy.model.User;
import com.akacin.sklep_szachowy.repository.CommentRepository;
import com.akacin.sklep_szachowy.repository.ProductRepository;
import com.akacin.sklep_szachowy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        List<Comment> comments = commentRepository.findByProductId(productId);
        return comments.stream()
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
}
