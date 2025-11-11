package com.akacin.sklep_szachowy.repository;

import com.akacin.sklep_szachowy.model.PasswordResetToken;
import com.akacin.sklep_szachowy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String token);
    PasswordResetToken findByUser(User user);
    @Modifying
    void deleteByUser(User user);
}
