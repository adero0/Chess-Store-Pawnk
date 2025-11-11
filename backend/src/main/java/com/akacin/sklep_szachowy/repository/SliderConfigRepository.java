package com.akacin.sklep_szachowy.repository;

import com.akacin.sklep_szachowy.model.SliderConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SliderConfigRepository extends JpaRepository<SliderConfig, Long> {
}
