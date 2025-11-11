package com.akacin.sklep_szachowy.controllers;

import com.akacin.sklep_szachowy.dto.CommentDto;
import com.akacin.sklep_szachowy.dto.CommentRequestDto;
import com.akacin.sklep_szachowy.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/products/{productId}/comments")
    public ResponseEntity<List<CommentDto>> getCommentsForProduct(@PathVariable Long productId) {
        List<CommentDto> comments = commentService.getCommentsForProduct(productId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/products/{productId}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentDto> createComment(@PathVariable Long productId,
                                                    @Valid @RequestBody CommentRequestDto commentRequestDto,
                                                    Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        CommentDto createdComment = commentService.createComment(productId, commentRequestDto, username);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

}
