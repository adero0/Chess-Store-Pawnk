package com.akacin.sklep_szachowy.controllers;

import com.akacin.sklep_szachowy.dto.SliderConfigDto;
import com.akacin.sklep_szachowy.model.SliderConfig;
import com.akacin.sklep_szachowy.service.SliderConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/slider-config")
public class SliderConfigController {

    @Autowired
    private SliderConfigService sliderConfigService;

    @GetMapping
    public ResponseEntity<SliderConfigDto> getSliderConfig() {
        SliderConfigDto sliderConfigDto = sliderConfigService.getSliderConfig();
        return ResponseEntity.ok(sliderConfigDto);
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<SliderConfigDto> updateSliderConfig(@RequestBody SliderConfig sliderConfig) {
        SliderConfigDto updatedSliderConfigDto = sliderConfigService.updateSliderConfig(sliderConfig);
        return ResponseEntity.ok(updatedSliderConfigDto);
    }
}
