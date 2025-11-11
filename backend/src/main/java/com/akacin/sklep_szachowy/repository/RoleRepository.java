package com.akacin.sklep_szachowy.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.akacin.sklep_szachowy.model.enums.ERole;
import com.akacin.sklep_szachowy.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByName(ERole name);

}
