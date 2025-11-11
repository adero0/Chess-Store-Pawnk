package com.akacin.sklep_szachowy.service;

import com.akacin.sklep_szachowy.dto.UserDto;
import com.akacin.sklep_szachowy.model.Role;
import com.akacin.sklep_szachowy.model.User;
import com.akacin.sklep_szachowy.model.enums.ERole;
import com.akacin.sklep_szachowy.repository.RoleRepository;
import com.akacin.sklep_szachowy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRoles()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRoles());
    }

    @Transactional
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    @Transactional
    public UserDto updateUser(Long userId, com.akacin.sklep_szachowy.dto.UserUpdateDto userUpdateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setUsername(userUpdateDto.getUsername());
        user.setEmail(userUpdateDto.getEmail());

        userRepository.save(user);
        return new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRoles());
    }

    @Transactional
    public UserDto updateUserRoles(Long userId, Set<String> roleNames) {
        if (roleNames == null || roleNames.isEmpty()) {
            throw new IllegalArgumentException("A user must have at least one role.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Set<Role> roles = roleNames.stream()
                .map(roleName -> roleRepository.findByName(ERole.valueOf(roleName))
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName)))
                .collect(Collectors.toSet());

        user.setRoles(roles);
        userRepository.save(user);
        return new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRoles());
    }
}
