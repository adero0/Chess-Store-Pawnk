package com.akacin.sklep_szachowy.controllers;

import com.akacin.sklep_szachowy.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/password")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/reset-request")
    public ResponseEntity<Void> resetPasswordRequest(@RequestBody Map<String, String> payload) {
        passwordResetService.createPasswordResetTokenForUser(payload.get("email"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset")
    public ResponseEntity<Void> resetPassword(@RequestBody Map<String, String> payload) {
        passwordResetService.resetPassword(payload.get("token"), payload.get("password"));
        return ResponseEntity.ok().build();
    }
}
