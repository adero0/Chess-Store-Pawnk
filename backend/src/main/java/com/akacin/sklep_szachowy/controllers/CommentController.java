package com.akacin.sklep_szachowy.controllers;

import com.akacin.sklep_szachowy.dto.CommentDto;
import com.akacin.sklep_szachowy.dto.CommentRequestDto;
import com.akacin.sklep_szachowy.model.enums.ECommentStatus;
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
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CommentDto>> getCommentsForProduct(@PathVariable Long productId) {
        List<CommentDto> comments = commentService.getCommentsForProduct(productId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/product/{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentDto> createComment(@PathVariable Long productId,
                                                    @Valid @RequestBody CommentRequestDto commentRequestDto,
                                                    Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        CommentDto createdComment = commentService.createComment(productId, commentRequestDto, username);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<CommentDto>> getPendingComments(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        return ResponseEntity.ok(commentService.getPendingCommentsForModerator(username));
    }

    @PutMapping("/{commentId}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<Void> updateCommentStatus(@PathVariable Long commentId, @RequestParam ECommentStatus status) {
        commentService.updateCommentStatus(commentId, status);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pending/count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<Integer> getPendingCommentsCount(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        return ResponseEntity.ok(commentService.countPendingCommentsForModerator(username));
    }
}
