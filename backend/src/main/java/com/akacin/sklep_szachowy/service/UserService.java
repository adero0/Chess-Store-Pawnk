package com.akacin.sklep_szachowy.service;

import com.akacin.sklep_szachowy.dto.RoleDto;
import com.akacin.sklep_szachowy.dto.UserDto;
import com.akacin.sklep_szachowy.model.Category;
import com.akacin.sklep_szachowy.model.Role;
import com.akacin.sklep_szachowy.model.User;
import com.akacin.sklep_szachowy.model.enums.ERole;
import com.akacin.sklep_szachowy.repository.CategoryRepository;
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

    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return new UserDto(user);
    }

    @Transactional(readOnly = true)
    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        return new UserDto(user);
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
        return new UserDto(user);
    }
    @Transactional
    public UserDto updateUserShippingDetails(Long userId, com.akacin.sklep_szachowy.dto.ShippingDetailsDto shippingDetailsDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        user.setShippingName(shippingDetailsDto.getShippingName());
        user.setShippingAddress(shippingDetailsDto.getShippingAddress());
        user.setShippingCity(shippingDetailsDto.getShippingCity());
        user.setShippingPostalCode(shippingDetailsDto.getShippingPostalCode());
        user.setShippingCountry(shippingDetailsDto.getShippingCountry());

        userRepository.save(user);
        return new UserDto(user);
    }

    @Transactional
    public UserDto updateUserRoles(Long userId, Set<RoleDto> roleDtos) {
        if (roleDtos == null || roleDtos.isEmpty()) {
            throw new IllegalArgumentException("A user must have at least one role.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Set<Role> roles = roleDtos.stream()
                .map(roleDto -> {
                    Role role;
                    if (roleDto.getName().equals(ERole.ROLE_MODERATOR)) {
                        if (roleDto.getCategoryId() == null) {
                            throw new IllegalArgumentException("Category ID is required for moderator role.");
                        }
                        Category category = categoryRepository.findById(roleDto.getCategoryId())
                                .orElseThrow(() -> new RuntimeException("Category not found with id: " + roleDto.getCategoryId()));

                        role = roleRepository.findByNameAndCategory(roleDto.getName(), category)
                                .orElseGet(() -> {
                                    Role newRole = new Role(roleDto.getName());
                                    newRole.setCategory(category);
                                    return roleRepository.save(newRole);
                                });

                    } else {
                        role = roleRepository.findByName(roleDto.getName())
                                .orElseThrow(() -> new RuntimeException("Role not found: " + roleDto.getName()));
                    }
                    return role;
                })
                .collect(Collectors.toSet());

        user.setRoles(roles);
        userRepository.save(user);
        return new UserDto(user);
    }
}