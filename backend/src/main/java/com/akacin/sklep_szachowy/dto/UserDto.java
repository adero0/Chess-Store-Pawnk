package com.akacin.sklep_szachowy.dto;

import com.akacin.sklep_szachowy.model.User;
import com.akacin.sklep_szachowy.model.Role;

import java.util.Set;
import java.util.stream.Collectors;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Set<RoleDto> roles;
    private String shippingName;
    private String shippingAddress;
    private String shippingCity;
    private String shippingPostalCode;
    private String shippingCountry;

    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.roles = user.getRoles().stream()
                .map(role -> new RoleDto(
                        role.getId(),
                        role.getName(),
                        role.getCategory() != null ? role.getCategory().getId() : null
                ))
                .collect(Collectors.toSet());
        this.shippingName = user.getShippingName();
        this.shippingAddress = user.getShippingAddress();
        this.shippingCity = user.getShippingCity();
        this.shippingPostalCode = user.getShippingPostalCode();
        this.shippingCountry = user.getShippingCountry();
    }

    public UserDto(Long id, String username, String email, Set<Role> roles, String shippingName, String shippingAddress, String shippingCity, String shippingPostalCode, String shippingCountry) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles.stream()
                .map(role -> new RoleDto(
                        role.getId(),
                        role.getName(),
                        role.getCategory() != null ? role.getCategory().getId() : null
                ))
                .collect(Collectors.toSet());
        this.shippingName = shippingName;
        this.shippingAddress = shippingAddress;
        this.shippingCity = shippingCity;
        this.shippingPostalCode = shippingPostalCode;
        this.shippingCountry = shippingCountry;
    }


    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Set<RoleDto> getRoles() {
        return roles;
    }

    public void setRoles(Set<RoleDto> roles) {
        this.roles = roles;
    }

    public String getShippingName() {
        return shippingName;
    }

    public void setShippingName(String shippingName) {
        this.shippingName = shippingName;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getShippingCity() {
        return shippingCity;
    }

    public void setShippingCity(String shippingCity) {
        this.shippingCity = shippingCity;
    }

    public String getShippingPostalCode() {
        return shippingPostalCode;
    }

    public void setShippingPostalCode(String shippingPostalCode) {
        this.shippingPostalCode = shippingPostalCode;
    }

    public String getShippingCountry() {
        return shippingCountry;
    }

    public void setShippingCountry(String shippingCountry) {
        this.shippingCountry = shippingCountry;
    }
}

