package com.akacin.sklep_szachowy.dto;

import com.akacin.sklep_szachowy.model.enums.ERole;

public class RoleDto {
    private Integer id;
    private ERole name;
    private Integer categoryId;

    public RoleDto(Integer id, ERole name, Integer categoryId) {
        this.id = id;
        this.name = name;
        this.categoryId = categoryId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ERole getName() {
        return name;
    }

    public void setName(ERole name) {
        this.name = name;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }
}
