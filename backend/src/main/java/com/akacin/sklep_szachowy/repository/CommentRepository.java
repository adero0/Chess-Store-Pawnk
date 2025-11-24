package com.akacin.sklep_szachowy.repository;

import com.akacin.sklep_szachowy.model.Comment;
import com.akacin.sklep_szachowy.model.enums.ECommentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByProductId(Long productId);

    List<Comment> findByProductIdAndStatus(Long productId, ECommentStatus status);

    List<Comment> findByProduct_Category_IdInAndStatus(List<Integer> categoryIds, ECommentStatus status);

    int countByProduct_Category_IdInAndStatus(List<Integer> categoryIds, ECommentStatus status);
}
